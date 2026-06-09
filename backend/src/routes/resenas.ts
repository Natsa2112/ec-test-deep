import { Router } from "express";
import { z } from "zod";
import { prisma } from "../app.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const resenaSchema = z.object({
  productoId: z.string().uuid(),
  calificacion: z.number().int().min(1).max(5),
  comentario: z.string().max(1000).optional(),
});

router.post("/", authenticate, async (req, res) => {
  try {
    const data = resenaSchema.parse(req.body);
    const usuarioId = req.user!.userId;

    const producto = await prisma.producto.findUnique({ where: { id: data.productoId } });
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    const existing = await prisma.resena.findUnique({
      where: { productoId_usuarioId: { productoId: data.productoId, usuarioId } },
    });
    if (existing) return res.status(409).json({ error: "Ya reseñaste este producto" });

    const resena = await prisma.resena.create({
      data: { ...data, usuarioId },
      include: { usuario: { select: { nombre: true, apellido: true } } },
    });

    const avg = await prisma.resena.aggregate({
      where: { productoId: data.productoId },
      _avg: { calificacion: true },
    });
    await prisma.producto.update({
      where: { id: data.productoId },
      data: { rating: avg._avg.calificacion ?? 0 },
    });

    res.status(201).json(resena);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    console.error(err);
    res.status(500).json({ error: "Error al crear reseña" });
  }
});

router.get("/producto/:productoId", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? "20"))));
    const skip = (page - 1) * limit;

    const [resenas, total, stats] = await Promise.all([
      prisma.resena.findMany({
        where: { productoId: req.params.productoId },
        orderBy: { creadoEn: "desc" },
        skip,
        take: limit,
        include: { usuario: { select: { nombre: true, apellido: true } } },
      }),
      prisma.resena.count({ where: { productoId: req.params.productoId } }),
      prisma.resena.aggregate({
        where: { productoId: req.params.productoId },
        _avg: { calificacion: true },
      }),
    ]);
    res.json({
      resenas,
      avg: stats._avg.calificacion ?? 0,
      total,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
});

export default router;
