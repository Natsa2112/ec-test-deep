import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { app } from "../app.js";

const api = supertest(app);
const clienteEmail = "cliente@test.com";
const clientePass = "password123";

let token = "";
let direccionId = "";

beforeAll(async () => {
  const login = await api.post("/api/auth/login").send({ email: clienteEmail, password: clientePass });
  token = login.body.token;
});

describe("GET /api/usuarios/perfil", () => {
  it("obtiene perfil del usuario autenticado", async () => {
    const res = await api.get("/api/usuarios/perfil").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(clienteEmail);
    expect(res.body.nombre).toBeDefined();
    expect(res.body.rol).toBe("cliente");
  });
});

describe("PUT /api/usuarios/perfil", () => {
  it("actualiza perfil del usuario", async () => {
    const res = await api
      .put("/api/usuarios/perfil")
      .set("Authorization", `Bearer ${token}`)
      .send({ telefono: "1144445555" });
    expect(res.status).toBe(200);
    expect(res.body.telefono).toBe("1144445555");
  });

  it("rechaza sin autenticación", async () => {
    const res = await api.get("/api/usuarios/perfil");
    expect(res.status).toBe(401);
  });
});

describe("CRUD direcciones", () => {
  it("POST /api/usuarios/direcciones crea dirección", async () => {
    const res = await api
      .post("/api/usuarios/direcciones")
      .set("Authorization", `Bearer ${token}`)
      .send({
        alias: "Trabajo",
        direccion: "Av. Corrientes 1500",
        ciudad: "Buenos Aires",
        provincia: "CABA",
        codigoPostal: "1042",
        esPrincipal: true,
      });
    expect(res.status).toBe(201);
    expect(res.body.esPrincipal).toBe(true);
    direccionId = res.body.id;
  });

  it("GET /api/usuarios/direcciones lista direcciones", async () => {
    const res = await api.get("/api/usuarios/direcciones").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("PUT /api/usuarios/direcciones/:id actualiza dirección", async () => {
    const res = await api
      .put(`/api/usuarios/direcciones/${direccionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ alias: "Oficina" });
    expect(res.status).toBe(200);
    expect(res.body.alias).toBe("Oficina");
  });

  it("DELETE /api/usuarios/direcciones/:id elimina dirección", async () => {
    const res = await api
      .delete(`/api/usuarios/direcciones/${direccionId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rechaza dirección de otro usuario", async () => {
    const adminLogin = await api.post("/api/auth/login").send({ email: "admin@techstore.com", password: "password123" });
    const adminToken = adminLogin.body.token;
    // Primero crear una dirección como admin
    const dir = await api
      .post("/api/usuarios/direcciones")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        alias: "Admin Dir",
        direccion: "Admin 123",
        ciudad: "BA",
        provincia: "BA",
        codigoPostal: "1000",
      });
    // Luego tratar de actualizar con otro token
    const res = await api
      .put(`/api/usuarios/direcciones/${dir.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ alias: "Hack" });
    expect(res.status).toBe(404);
  });
});
