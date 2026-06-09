import { Router } from "express";
import { prisma } from "../app.js";

const router = Router();

const VALID_SORT_FIELDS = ["precio", "nombre", "createdAt", "rating"];

router.get("/", async (req, res) => {
  try {
    const { categoria, search, minPrice, maxPrice, marca, destacado, enOferta, page = "1", limit = "12", sort = "createdAt" } = req.query;

    const where: any = { activo: true };

    if (categoria) where.categoria = { slug: String(categoria) };
    if (search) {
      where.OR = [
        { nombre: { contains: String(search), mode: "insensitive" } },
        { descripcion: { contains: String(search), mode: "insensitive" } },
        { marca: { contains: String(search), mode: "insensitive" } },
      ];
    }
    if (minPrice) {
      const min = parseFloat(String(minPrice));
      if (!isNaN(min)) where.precio = { ...where.precio, gte: min };
    }
    if (maxPrice) {
      const max = parseFloat(String(maxPrice));
      if (!isNaN(max)) where.precio = { ...where.precio, lte: max };
    }
    if (marca) where.marca = { in: String(marca).split(",") };
    if (destacado === "true") where.destacado = true;
    if (enOferta === "true") where.enOferta = true;

    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit))));
    const skip = (pageNum - 1) * limitNum;

    const sortField = String(sort);
    const isAsc = sortField === "precio_asc";
    const actualField = isAsc ? "precio" : (VALID_SORT_FIELDS.includes(sortField) ? sortField : "createdAt");
    const orderBy = { [actualField]: isAsc ? "asc" : "desc" as const };

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          categoria: { select: { nombre: true, slug: true } },
          _count: { select: { resenas: true } },
        },
      }),
      prisma.producto.count({ where }),
    ]);

    res.json({
      productos,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const producto = await prisma.producto.findUnique({
      where: { slug: req.params.slug },
      include: {
        categoria: { select: { nombre: true, slug: true, padre: { select: { nombre: true, slug: true } } } },
        especificaciones: true,
        resenas: {
          include: { usuario: { select: { nombre: true, apellido: true } } },
          orderBy: { creadoEn: "desc" },
          take: 50,
        },
      },
    });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

export default router;
