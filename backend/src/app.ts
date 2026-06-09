import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import categoriaRoutes from "./routes/categorias.js";
import productRoutes from "./routes/productos.js";
import adminRoutes from "./routes/admin.js";
import carritoRoutes from "./routes/carrito.js";
import pedidoRoutes from "./routes/pedidos.js";
import resenaRoutes from "./routes/resenas.js";
import usuarioRoutes from "./routes/usuario.js";

export const prisma = new PrismaClient();

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:4321" }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", db: "disconnected" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/resenas", resenaRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
