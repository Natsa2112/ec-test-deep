import { Router } from "express";
import { prisma } from "../app.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
      include: {
        hijos: { where: { activo: true }, orderBy: { orden: "asc" } },
        _count: { select: { productos: { where: { activo: true } } } },
      },
    });
    res.json(categorias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { slug: req.params.slug },
      include: {
        hijos: { where: { activo: true }, orderBy: { orden: "asc" } },
        padre: true,
        _count: { select: { productos: { where: { activo: true } } } },
      },
    });
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json(categoria);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener categoría" });
  }
});

export default router;
