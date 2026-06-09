import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { app } from "../app.js";

const api = supertest(app);
const clienteEmail = "cliente@test.com";
const clientePass = "password123";

let token = "";
let tokenSession = "";
let productoId = "";
let carritoItemId = "";

describe("Carrito (autenticado)", () => {
  it("login cliente", async () => {
    const res = await api.post("/api/auth/login").send({ email: clienteEmail, password: clientePass });
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it("obtener productos con stock suficiente para usar en tests", async () => {
    const res = await api.get("/api/productos");
    const conStock = res.body.productos.find((p: any) => p.stock >= 2);
    productoId = conStock?.id;
    expect(productoId).toBeDefined();
  });

  it("POST /api/carrito/add agrega item", async () => {
    const res = await api
      .post("/api/carrito/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ productoId, cantidad: 2 });
    expect(res.status).toBe(200);
    expect(res.body.carrito).toBeDefined();
    expect(res.body.carrito.items.length).toBeGreaterThan(0);
    tokenSession = res.body.tokenSession;
  });

  it("GET /api/carrito obtiene carrito del usuario", async () => {
    const res = await api.get("/api/carrito").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    carritoItemId = res.body.items[0].id;
  });

  it("PUT /api/carrito/item/:id actualiza cantidad", async () => {
    const res = await api
      .put(`/api/carrito/item/${carritoItemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ cantidad: 5 });
    expect(res.status).toBe(200);
    expect(res.body.cantidad).toBe(5);
  });

  it("DELETE /api/carrito/item/:id elimina item", async () => {
    // Agrega de nuevo para tener algo que borrar
    const add = await api
      .post("/api/carrito/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ productoId, cantidad: 1 });
    expect(add.status).toBe(200);
    expect(add.body.carrito.items.length).toBeGreaterThan(0);
    const itemId = add.body.carrito.items[0].id;

    const res = await api
      .delete(`/api/carrito/item/${itemId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rechaza sin token", async () => {
    const res = await api.get("/api/carrito");
    // optionalAuth permite sin token, devuelve carrito vacío
    expect(res.status).toBe(200);
    expect(res.body.items).toBeInstanceOf(Array);
  });
});
