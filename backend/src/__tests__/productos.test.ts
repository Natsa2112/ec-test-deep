import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { app } from "../app.js";

const api = supertest(app);

describe("GET /api/productos", () => {
  it("lista productos activos con paginación", async () => {
    const res = await api.get("/api/productos");
    expect(res.status).toBe(200);
    expect(res.body.productos).toBeInstanceOf(Array);
    expect(res.body.productos.length).toBeGreaterThan(0);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.total).toBeGreaterThan(0);
  });

  it("filtra por categoría (slug)", async () => {
    const res = await api.get("/api/productos?categoria=smartphones");
    expect(res.status).toBe(200);
    expect(res.body.productos.every((p: any) => p.categoria.slug === "smartphones")).toBe(true);
  });

  it("filtra por search", async () => {
    const res = await api.get("/api/productos?search=iphone");
    expect(res.status).toBe(200);
    expect(res.body.productos.length).toBeGreaterThan(0);
  });

  it("filtra por destacado", async () => {
    const res = await api.get("/api/productos?destacado=true");
    expect(res.status).toBe(200);
    expect(res.body.productos.every((p: any) => p.destacado === true)).toBe(true);
  });

  it("filtra por rango de precio", async () => {
    const res = await api.get("/api/productos?minPrice=1000000&maxPrice=2000000");
    expect(res.status).toBe(200);
    expect(res.body.productos.every((p: any) => Number(p.precio) >= 1000000 && Number(p.precio) <= 2000000)).toBe(true);
  });

  it("ordena por precio ascendente", async () => {
    const res = await api.get("/api/productos?sort=precio_asc");
    expect(res.status).toBe(200);
    const precios = res.body.productos.map((p: any) => Number(p.precio));
    for (let i = 1; i < precios.length; i++) {
      expect(precios[i]).toBeGreaterThanOrEqual(precios[i - 1]);
    }
  });
});

describe("GET /api/productos/:slug", () => {
  it("obtiene producto por slug", async () => {
    const res = await api.get("/api/productos/iphone-15-pro-max-256gb");
    expect(res.status).toBe(200);
    expect(res.body.nombre).toContain("iPhone 15 Pro Max");
    expect(res.body.especificaciones).toBeInstanceOf(Array);
    expect(res.body.categoria).toBeDefined();
  });

  it("404 para slug inexistente", async () => {
    const res = await api.get("/api/productos/slug-inexistente");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/no encontrado/i);
  });
});

describe("GET /api/categorias", () => {
  it("lista categorías activas con hijos", async () => {
    const res = await api.get("/api/categorias");
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    const padres = res.body.filter((c: any) => !c.padreId);
    expect(padres.length).toBeGreaterThan(0);
  });
});

describe("GET /api/categorias/:slug", () => {
  it("obtiene categoría por slug", async () => {
    const res = await api.get("/api/categorias/celulares");
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe("Celulares");
    expect(res.body.hijos).toBeInstanceOf(Array);
  });

  it("404 para slug inexistente", async () => {
    const res = await api.get("/api/categorias/no-existe");
    expect(res.status).toBe(404);
  });
});
