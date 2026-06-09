import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { app } from "../app.js";

const api = supertest(app);

let adminToken = "";
let productId = "";
let categoriaId = "";

beforeAll(async () => {
  const login = await api.post("/api/auth/login").send({ email: "admin@techstore.com", password: "password123" });
  adminToken = login.body.token;

  const cats = await api.get("/api/admin/categorias").set("Authorization", `Bearer ${adminToken}`);
  if (cats.body.length > 0) {
    categoriaId = cats.body[0].id;
  }
});

describe("Admin Auth", () => {
  it("rechaza sin token", async () => {
    const res = await api.get("/api/admin/productos");
    expect(res.status).toBe(401);
  });

  it("rechaza con token de cliente", async () => {
    const login = await api.post("/api/auth/login").send({ email: "cliente@test.com", password: "password123" });
    const clientToken = login.body.token;
    const res = await api.get("/api/admin/productos").set("Authorization", `Bearer ${clientToken}`);
    expect(res.status).toBe(403);
  });
});

describe("Admin Productos CRUD", () => {
  const slug = `test-prod-${Date.now()}`;

  it("GET /api/admin/productos lista productos", async () => {
    const res = await api.get("/api/admin/productos").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.productos).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });

  it("POST /api/admin/productos crea producto", async () => {
    const res = await api
      .post("/api/admin/productos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        categoriaId,
        nombre: "Producto Test",
        slug,
        descripcion: "Descripción test",
        precio: 99999,
        stock: 10,
        marca: "TestBrand",
      });
    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe("Producto Test");
    productId = res.body.id;
  });

  it("PUT /api/admin/productos/:id actualiza producto", async () => {
    const res = await api
      .put(`/api/admin/productos/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ precio: 88888 });
    expect(res.status).toBe(200);
    expect(Number(res.body.precio)).toBe(88888);
  });

  it("DELETE /api/admin/productos/:id elimina producto", async () => {
    const res = await api
      .delete(`/api/admin/productos/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Admin Categorías CRUD", () => {
  const slug = `test-cat-${Date.now()}`;
  let catId = "";

  it("POST /api/admin/categorias crea categoría", async () => {
    const res = await api
      .post("/api/admin/categorias")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nombre: "Categoría Test",
        slug,
        descripcion: "Categoría de prueba",
        orden: 99,
      });
    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe("Categoría Test");
    catId = res.body.id;
  });

  it("PUT /api/admin/categorias/:id actualiza categoría", async () => {
    const res = await api
      .put(`/api/admin/categorias/${catId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ nombre: "Categoría Test Updated" });
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe("Categoría Test Updated");
  });

  it("DELETE /api/admin/categorias/:id elimina categoría", async () => {
    const res = await api
      .delete(`/api/admin/categorias/${catId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});

describe("Admin Usuarios", () => {
  it("GET /api/admin/usuarios lista usuarios", async () => {
    const res = await api.get("/api/admin/usuarios").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.usuarios).toBeInstanceOf(Array);
    expect(res.body.usuarios.length).toBeGreaterThan(0);
    expect(res.body.usuarios[0].email).toBeDefined();
    // No debe exponer password_hash
    expect(res.body.usuarios[0].passwordHash).toBeUndefined();
  });
});

describe("Admin Pedidos", () => {
  let pedidoId = "";

  it("GET /api/admin/pedidos lista pedidos", async () => {
    const res = await api.get("/api/admin/pedidos").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.pedidos).toBeInstanceOf(Array);
    if (res.body.pedidos.length > 0) {
      pedidoId = res.body.pedidos[0].id;
    }
  });

  it("PATCH /api/admin/pedidos/:id/estado cambia estado", async () => {
    if (!pedidoId) return; // skip si no hay pedidos
    const res = await api
      .patch(`/api/admin/pedidos/${pedidoId}/estado`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ estado: "confirmado" });
    expect(res.status).toBe(200);
    expect(res.body.estado).toBe("confirmado");
  });
});
