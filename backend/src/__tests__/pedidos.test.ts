import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import { app, prisma } from "../app.js";

const api = supertest(app);
const clienteEmail = "cliente@test.com";
const clientePass = "password123";
const adminEmail = "admin@techstore.com";
const adminPass = "password123";

let token = "";
let productoId = "";
let direccionId = "";
let pedidoId = "";

// Creamos un producto de prueba para evitar problemas de stock
const testSlug = `test-pedido-${Date.now()}`;

beforeAll(async () => {
  // Login como admin para crear un producto de prueba
  const adminLogin = await api.post("/api/auth/login").send({ email: adminEmail, password: adminPass });
  const adminToken = adminLogin.body.token;

  // Obtener una categoría válida
  const cats = await api.get("/api/admin/categorias").set("Authorization", `Bearer ${adminToken}`);
  const catId = cats.body[0]?.id ?? cats.body.find((c: any) => !c.padreId)?.id;

  // Crear producto de prueba con stock alto
  const prod = await api
    .post("/api/admin/productos")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      categoriaId: catId,
      nombre: "Producto Test Pedido",
      slug: testSlug,
      descripcion: "Producto creado para tests de pedidos",
      precio: 50000,
      stock: 100,
      marca: "Test",
    });
  productoId = prod.body.id;

  // Login como cliente
  const login = await api.post("/api/auth/login").send({ email: clienteEmail, password: clientePass });
  token = login.body.token;
});

afterAll(async () => {
  // Limpiar producto de prueba
  if (productoId) {
    try {
      await prisma.producto.delete({ where: { id: productoId } });
    } catch {}
  }
});

describe("POST /api/pedidos", () => {
  it("crea dirección de envío", async () => {
    const res = await api
      .post("/api/usuarios/direcciones")
      .set("Authorization", `Bearer ${token}`)
      .send({
        alias: "Casa Test",
        direccion: "Av. Siempre Viva 123",
        ciudad: "Buenos Aires",
        provincia: "CABA",
        codigoPostal: "1000",
      });
    expect(res.status).toBe(201);
    direccionId = res.body.id;
  });

  it("agrega producto al carrito", async () => {
    const res = await api
      .post("/api/carrito/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ productoId, cantidad: 1 });
    expect(res.status).toBe(200);
  });

  it("crea pedido desde carrito", async () => {
    const res = await api
      .post("/api/pedidos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        direccionEnvioId: direccionId,
        metodoPago: "mercadopago",
        metodoEnvio: "standard",
      });
    expect(res.status).toBe(201);
    expect(res.body.numeroPedido).toMatch(/^ORD-/);
    expect(Number(res.body.total)).toBeGreaterThan(0);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.historial.length).toBeGreaterThan(0);
    pedidoId = res.body.id;
  });

  it("rechaza pedido con carrito vacío", async () => {
    const res = await api
      .post("/api/pedidos")
      .set("Authorization", `Bearer ${token}`)
      .send({ direccionEnvioId: direccionId, metodoPago: "mercadopago" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/vacío/i);
  });
});

describe("GET /api/pedidos", () => {
  it("lista pedidos del usuario autenticado", async () => {
    const res = await api.get("/api/pedidos").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.pedidos)).toBe(true);
    expect(res.body.pedidos.length).toBeGreaterThan(0);
    expect(res.body.pedidos[0].items).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });
});

describe("GET /api/pedidos/:id", () => {
  it("obtiene detalle del pedido", async () => {
    const res = await api.get(`/api/pedidos/${pedidoId}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(pedidoId);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.historial).toBeInstanceOf(Array);
    expect(res.body.direccionEnvio).toBeDefined();
  });

  it("404 para pedido de otro usuario", async () => {
    const adminLogin = await api.post("/api/auth/login").send({ email: adminEmail, password: adminPass });
    const adminToken = adminLogin.body.token;
    const res = await api.get(`/api/pedidos/${pedidoId}`).set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
