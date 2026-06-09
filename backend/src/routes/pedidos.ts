import { Router } from "express";
import { z } from "zod";
import { prisma } from "../app.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

function generarNumeroPedido(): string {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `ORD-${fecha}-${rand}`;
}

const createPedidoSchema = z.object({
  direccionEnvioId: z.string().uuid(),
  metodoPago: z.string().min(1),
  metodoEnvio: z.string().optional(),
  nota: z.string().optional(),
});

router.post("/", async (req, res) => {
  try {
    const usuarioId = req.user!.userId;
    const { direccionEnvioId, metodoPago, metodoEnvio, nota } = createPedidoSchema.parse(req.body);

    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
      include: { items: { include: { producto: true } } },
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    const subtotal = carrito.items.reduce((sum, item) => sum + Number(item.precioUnitario) * item.cantidad, 0);
    const envioCosto = subtotal >= 100000 ? 0 : 15000;
    const descuento = 0;
    const total = subtotal + envioCosto - descuento;

    const pedido = await prisma.$transaction(async (tx) => {
      for (const item of carrito.items) {
        const producto = await tx.producto.findUnique({ where: { id: item.productoId } });
        if (!producto || producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para ${item.producto.nombre}`);
        }
      }

      const nuevoPedido = await tx.pedido.create({
        data: {
          usuarioId,
          numeroPedido: generarNumeroPedido(),
          subtotal,
          envioCosto,
          descuento,
          total,
          metodoPago,
          metodoEnvio,
          direccionEnvioId,
          nota,
          items: {
            create: carrito.items.map((item) => ({
              productoId: item.productoId,
              nombreProducto: item.producto.nombre,
              precioUnitario: item.precioUnitario,
              cantidad: item.cantidad,
              subtotal: Number(item.precioUnitario) * item.cantidad,
            })),
          },
          historial: {
            create: { estado: "pendiente", comentario: "Pedido creado" },
          },
        },
        include: { items: true, historial: true },
      });

      await tx.carritoItem.deleteMany({ where: { carritoId: carrito.id } });

      for (const item of carrito.items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: { stock: { decrement: item.cantidad } },
        });
      }

      return nuevoPedido;
    });

    res.status(201).json(pedido);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    if (err instanceof Error && err.message.startsWith("Stock insuficiente")) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Error al crear pedido" });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? "20"))));
    const skip = (page - 1) * limit;

    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where: { usuarioId: req.user!.userId },
        orderBy: { creadoEn: "desc" },
        skip,
        take: limit,
        include: {
          items: { include: { producto: { select: { slug: true, imagenes: true } } } },
          historial: { orderBy: { creadoEn: "desc" } },
        },
      }),
      prisma.pedido.count({ where: { usuarioId: req.user!.userId } }),
    ]);
    res.json({ pedidos, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pedido = await prisma.pedido.findFirst({
      where: { id: req.params.id, usuarioId: req.user!.userId },
      include: {
        items: { include: { producto: { select: { slug: true, imagenes: true } } } },
        historial: { orderBy: { creadoEn: "desc" } },
        direccionEnvio: true,
      },
    });
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener pedido" });
  }
});

export default router;
