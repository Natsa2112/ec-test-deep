import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { prisma } from "../app.js";
import { generateToken } from "../middleware/auth.js";

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Demasiados intentos. Intentalo de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(limiter);

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  telefono: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ error: "Email ya registrado" });
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        email: data.email,
        passwordHash,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
      },
    });
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      avatarUrl: usuario.avatarUrl,
      rol: usuario.rol,
    });
    res.status(201).json({
      token,
      user: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, avatarUrl: usuario.avatarUrl, rol: usuario.rol },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const usuario = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const valid = await bcrypt.compare(data.password, usuario.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      avatarUrl: usuario.avatarUrl,
      rol: usuario.rol,
    });
    res.json({
      token,
      user: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, rol: usuario.rol },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Datos inválidos", details: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
