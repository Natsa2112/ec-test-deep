import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { app, prisma } from "../app.js";

const api = supertest(app);
const clienteEmail = "cliente@test.com";
const clientePass = "password123";

let token = "";
const productoId = "30000000-0000-0000-0000-000000000003";

describe("POST /api/resenas", () => {
  beforeAll(async () => {
    const res = await api.post("/api/auth/login").send({ email: clienteEmail, password: clientePass });
    token = res.body.token;

    // Limpiar reseña previa para este producto/usuario
    const user = await prisma.usuario.findUnique({ where: { email: clienteEmail } });
    if (user) {
      const review = await prisma.resena.findUnique({
        where: { productoId_usuarioId: { productoId, usuarioId: user.id } },
      });
      if (review) await prisma.resena.delete({ where: { id: review.id } });
    }
  });

  it("crea reseña", async () => {
    const res = await api
      .post("/api/resenas")
      .set("Authorization", `Bearer ${token}`)
      .send({ productoId, calificacion: 4, comentario: "Muy buen producto" });
    expect(res.status).toBe(201);
    expect(res.body.calificacion).toBe(4);
    expect(res.body.usuario).toBeDefined();
  });

  it("rechaza reseña duplicada", async () => {
    const res = await api
      .post("/api/resenas")
      .set("Authorization", `Bearer ${token}`)
      .send({ productoId, calificacion: 3, comentario: "Otro comentario" });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/reseñaste/i);
  });

  it("rechaza calificación inválida", async () => {
    const res = await api
      .post("/api/resenas")
      .set("Authorization", `Bearer ${token}`)
      .send({ productoId: "30000000-0000-0000-0000-000000000011", calificacion: 6 });
    expect(res.status).toBe(400);
  });

  it("rechaza reseña sin autenticación", async () => {
    const res = await api
      .post("/api/resenas")
      .send({ productoId, calificacion: 5 });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/resenas/producto/:productoId", () => {
  it("obtiene reseñas del producto que reseñamos", async () => {
    const res = await api.get(`/api/resenas/producto/${productoId}`);
    expect(res.status).toBe(200);
    expect(res.body.resenas).toBeInstanceOf(Array);
    expect(res.body.resenas.length).toBeGreaterThan(0);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it("producto sin reseñas devuelve array vacío", async () => {
    const res = await api.get("/api/resenas/producto/30000000-0000-0000-0000-000000000005");
    expect(res.status).toBe(200);
    expect(res.body.resenas).toBeInstanceOf(Array);
    expect(res.body.total).toBe(0);
  });
});
