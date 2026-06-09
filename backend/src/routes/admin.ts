import { Router } from "express";
import { z } from "zod";
import { prisma } from "../app.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(authenticate, requireAdmin);

const productoSchema = z.object({
  categoriaId: z.string().uuid(),
  nombre: z.string().min(1),
  slug: z.string().min(1),
  descripcion: z.string().optional(),
  precio: z.number().positive(),
  precioAnterior: z.number().optional(),
  stock: z.number().int().min(0).default(0),
  sku: z.string().optional(),
  marca: z.string().optional(),
  pesoKg: z.number().optional(),
  activo: z.boolean().default(true),
  destacado: z.boolean().default(false),
  enOferta: z.boolean().default(false),
  descuento: z.number().int().min(0).max(100).default(0),
  imagenes: z.array(z.string()).optional(),
});

router.get("/productos", async (req, res) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: { categoria: { select: { id: true, nombre: true, slug: true } }, _count: { select: { pedidoItems: true } } },
      }),
      prisma.producto.count(),
    ]);
    res.json({ productos, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.post("/productos", async (req, res) => {
  try {
    const data = productoSchema.parse(req.body);
    const producto = await prisma.producto.create({ data });
    res.status(201).json(producto);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    console.error(err);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

router.put("/productos/:id", async (req, res) => {
  try {
    const data = productoSchema.partial().parse(req.body);
    const producto = await prisma.producto.update({ where: { id: req.params.id }, data });
    res.json(producto);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Producto no encontrado" });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

router.delete("/productos/:id", async (req, res) => {
  try {
    await prisma.producto.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Producto no encontrado" });
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

const categoriaSchema = z.object({
  nombre: z.string().min(1),
  slug: z.string().min(1),
  descripcion: z.string().optional(),
  imagenUrl: z.string().optional(),
  padreId: z.string().uuid().optional(),
  activo: z.boolean().default(true),
  orden: z.number().int().default(0),
});

router.get("/categorias", async (_req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { orden: "asc" },
      include: { _count: { select: { productos: true, hijos: true } } },
    });
    res.json(categorias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

router.post("/categorias", async (req, res) => {
  try {
    const data = categoriaSchema.parse(req.body);
    const categoria = await prisma.categoria.create({ data });
    res.status(201).json(categoria);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    console.error(err);
    res.status(500).json({ error: "Error al crear categoría" });
  }
});

router.put("/categorias/:id", async (req, res) => {
  try {
    const data = categoriaSchema.partial().parse(req.body);
    const categoria = await prisma.categoria.update({ where: { id: req.params.id }, data });
    res.json(categoria);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Categoría no encontrada" });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
});

router.delete("/categorias/:id", async (req, res) => {
  try {
    await prisma.categoria.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Categoría no encontrada" });
    console.error(err);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
});

router.get("/usuarios", async (req, res) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        orderBy: { creadoEn: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: { id: true, email: true, nombre: true, apellido: true, rol: true, creadoEn: true, _count: { select: { pedidos: true } } },
      }),
      prisma.usuario.count(),
    ]);
    res.json({ usuarios, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.get("/pedidos", async (req, res) => {
  try {
    const { page = "1", limit = "20", estado } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const where: any = {};
    if (estado) where.estado = String(estado);
    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        orderBy: { creadoEn: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: { usuario: { select: { nombre: true, apellido: true, email: true } }, items: true },
      }),
      prisma.pedido.count({ where }),
    ]);
    res.json({ pedidos, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

router.patch("/pedidos/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado) return res.status(400).json({ error: "Estado requerido" });
    const pedido = await prisma.pedido.update({
      where: { id: req.params.id },
      data: { estado },
    });
    await prisma.pedidoHistorial.create({
      data: { pedidoId: pedido.id, estado, comentario: `Estado cambiado por admin` },
    });
    res.json(pedido);
  } catch (err) {
    if ((err as any)?.code === "P2025") return res.status(404).json({ error: "Pedido no encontrado" });
    console.error(err);
    res.status(500).json({ error: "Error al actualizar pedido" });
  }
});

export default router;
