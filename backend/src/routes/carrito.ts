import { Router } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../app.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  try {
    const usuarioId = req.user?.userId;
    let carrito;
    if (usuarioId) {
      carrito = await prisma.carrito.findUnique({
        where: { usuarioId },
        include: { items: { include: { producto: { select: { id: true, nombre: true, slug: true, precio: true, imagenes: true, stock: true } } } } },
      });
    }
    if (!carrito && req.headers["x-session-token"]) {
      carrito = await prisma.carrito.findFirst({
        where: { tokenSession: String(req.headers["x-session-token"]) },
        include: { items: { include: { producto: { select: { id: true, nombre: true, slug: true, precio: true, imagenes: true, stock: true } } } } },
      });
    }
    res.json(carrito ?? { items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

const addSchema = z.object({
  productoId: z.string().uuid(),
  cantidad: z.number().int().positive().default(1),
});

router.post("/add", optionalAuth, async (req, res) => {
  try {
    const { productoId, cantidad } = addSchema.parse(req.body);
    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    if (producto.stock < cantidad) return res.status(400).json({ error: "Stock insuficiente" });

    const usuarioId = req.user?.userId;
    const tokenSession = String(req.headers["x-session-token"] ?? crypto.randomUUID());

    let carrito = usuarioId
      ? await prisma.carrito.findUnique({ where: { usuarioId } })
      : await prisma.carrito.findFirst({ where: { tokenSession } });

    if (!carrito) {
      carrito = await prisma.carrito.create({
        data: usuarioId ? { usuarioId } : { tokenSession },
      });
    }

    const existingItem = await prisma.carritoItem.findFirst({
      where: { carritoId: carrito.id, productoId },
    });

    if (existingItem) {
      await prisma.carritoItem.update({
        where: { id: existingItem.id },
        data: { cantidad: existingItem.cantidad + cantidad, precioUnitario: producto.precio },
      });
    } else {
      await prisma.carritoItem.create({
        data: { carritoId: carrito.id, productoId, cantidad, precioUnitario: producto.precio },
      });
    }

    const updated = await prisma.carrito.findUnique({
      where: { id: carrito.id },
      include: { items: { include: { producto: true } } },
    });

    res.json({ carrito: updated, tokenSession });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    console.error(err);
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
});

async function verificarItemPerteneceAUsuario(itemId: string, usuarioId: string): Promise<boolean> {
  const item = await prisma.carritoItem.findUnique({
    where: { id: itemId },
    include: { carrito: { select: { usuarioId: true } } },
  });
  return item?.carrito?.usuarioId === usuarioId;
}

const updateItemSchema = z.object({
  cantidad: z.number().int().positive(),
});

router.put("/item/:id", authenticate, async (req, res) => {
  try {
    const { cantidad } = updateItemSchema.parse(req.body);
    const pertenece = await verificarItemPerteneceAUsuario(req.params.id, req.user!.userId);
    if (!pertenece) return res.status(404).json({ error: "Item no encontrado" });

    const item = await prisma.carritoItem.update({
      where: { id: req.params.id },
      data: { cantidad },
    });
    res.json(item);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Item no encontrado" });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar item" });
  }
});

router.delete("/item/:id", authenticate, async (req, res) => {
  try {
    const pertenece = await verificarItemPerteneceAUsuario(req.params.id, req.user!.userId);
    if (!pertenece) return res.status(404).json({ error: "Item no encontrado" });

    await prisma.carritoItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Item no encontrado" });
    console.error(err);
    res.status(500).json({ error: "Error al eliminar item" });
  }
});

export default router;
