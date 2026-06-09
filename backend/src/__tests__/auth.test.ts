import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { app } from "../app.js";

const api = supertest(app);

describe("GET /api/health", () => {
  it("responde con status ok", async () => {
    const res = await api.get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.timestamp).toBeDefined();
  });
});

describe("POST /api/auth/register", () => {
  const email = `test-${Date.now()}@example.com`;

  it("registra un nuevo usuario", async () => {
    const res = await api.post("/api/auth/register").send({
      email,
      password: "12345678",
      nombre: "Test",
      apellido: "User",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(email);
    expect(res.body.user.rol).toBe("cliente");
    expect(res.body.user.nombre).toBe("Test");
  });

  it("rechaza email duplicado", async () => {
    const res = await api.post("/api/auth/register").send({
      email,
      password: "12345678",
      nombre: "Test",
      apellido: "User",
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/registrado/i);
  });

  it("rechaza datos inválidos", async () => {
    const res = await api.post("/api/auth/register").send({
      email: "no-es-email",
      password: "12",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/inválidos/i);
  });
});

describe("POST /api/auth/login", () => {
  it("loguea con credenciales correctas", async () => {
    const res = await api.post("/api/auth/login").send({
      email: "admin@techstore.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("admin@techstore.com");
    expect(res.body.user.rol).toBe("admin");
  });

  it("rechaza password incorrecto", async () => {
    const res = await api.post("/api/auth/login").send({
      email: "admin@techstore.com",
      password: "wrongpass",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/inválidas/i);
  });

  it("rechaza email inexistente", async () => {
    const res = await api.post("/api/auth/login").send({
      email: "noexiste@test.com",
      password: "password123",
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/inválidas/i);
  });
});
