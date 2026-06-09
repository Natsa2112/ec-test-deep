import { Router } from "express";
import { z } from "zod";
import { prisma } from "../app.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const perfilSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido").max(100).optional(),
  apellido: z.string().min(1, "Apellido requerido").max(100).optional(),
  telefono: z.string().max(50).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

const direccionSchema = z.object({
  alias: z.string().min(1).max(50).default("Principal"),
  direccion: z.string().min(1, "Dirección requerida").max(200),
  ciudad: z.string().min(1, "Ciudad requerida").max(100),
  provincia: z.string().min(1, "Provincia requerida").max(100),
  codigoPostal: z.string().min(1, "Código postal requerido").max(20),
  pais: z.string().min(1).max(100).default("Argentina"),
  esPrincipal: z.boolean().default(false),
});

router.get("/perfil", authenticate, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, nombre: true, apellido: true, telefono: true, avatarUrl: true, rol: true, creadoEn: true },
    });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

router.put("/perfil", authenticate, async (req, res) => {
  try {
    const data = perfilSchema.parse(req.body);
    const usuario = await prisma.usuario.update({
      where: { id: req.user!.userId },
      data,
      select: { id: true, email: true, nombre: true, apellido: true, telefono: true, avatarUrl: true, rol: true },
    });
    res.json(usuario);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
});

router.get("/direcciones", authenticate, async (req, res) => {
  try {
    const direcciones = await prisma.direccion.findMany({ where: { usuarioId: req.user!.userId }, orderBy: { creadoEn: "desc" } });
    res.json(direcciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener direcciones" });
  }
});

router.post("/direcciones", authenticate, async (req, res) => {
  try {
    const data = direccionSchema.parse(req.body);
    if (data.esPrincipal) {
      await prisma.direccion.updateMany({ where: { usuarioId: req.user!.userId }, data: { esPrincipal: false } });
    }
    const nueva = await prisma.direccion.create({
      data: { usuarioId: req.user!.userId, ...data },
    });
    res.status(201).json(nueva);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    console.error(err);
    res.status(500).json({ error: "Error al crear dirección" });
  }
});

router.put("/direcciones/:id", authenticate, async (req, res) => {
  try {
    const data = direccionSchema.partial().parse(req.body);
    if (data.esPrincipal) {
      await prisma.direccion.updateMany({ where: { usuarioId: req.user!.userId }, data: { esPrincipal: false } });
    }
    const updated = await prisma.direccion.update({
      where: { id: req.params.id, usuarioId: req.user!.userId },
      data,
    });
    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Dirección no encontrada" });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar dirección" });
  }
});

router.delete("/direcciones/:id", authenticate, async (req, res) => {
  try {
    await prisma.direccion.delete({ where: { id: req.params.id, usuarioId: req.user!.userId } });
    res.json({ success: true });
  } catch (err) {
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Dirección no encontrada" });
    console.error(err);
    res.status(500).json({ error: "Error al eliminar dirección" });
  }
});

export default router;
