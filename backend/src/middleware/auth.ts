import prisma from "@prisma/client/index.js";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno");
}

export interface AuthPayload {
  userId: string;
  email: string;
  rol: "cliente" | "admin";
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      const token = header.slice(7);
      req.user = jwt.verify(token, JWT_SECRET) as AuthPayload;
    } catch {}
  }
  next();
}
