import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { prisma } from "../app.js";
import { generateToken } from "../middleware/auth.js";
import crypto from "crypto";

const FRONTEND_URL = process.env.CORS_ORIGIN ?? "http://localhost:4321";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${FRONTEND_URL}/api/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: (err: Error | null, user?: any) => void) => {
      try {
        const email = profile.emails?.[0]?.value ?? `${profile.id}@google.com`;
        let usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
          usuario = await prisma.usuario.create({
            data: {
              email,
              passwordHash: crypto.randomBytes(32).toString("hex"),
              nombre: profile.name?.givenName ?? profile.displayName ?? "Usuario",
              apellido: profile.name?.familyName ?? "Google",
            },
          });
        }
        done(null, usuario);
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${FRONTEND_URL}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (_accessToken: string, _refreshToken: string, profile: any, done: (err: Error | null, user?: any) => void) => {
      try {
        const email = profile.emails?.[0]?.value ?? `${profile.id}@github.com`;
        let usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
          usuario = await prisma.usuario.create({
            data: {
              email,
              passwordHash: crypto.randomBytes(32).toString("hex"),
              nombre: profile.displayName ?? profile.username ?? "Usuario",
              apellido: "GitHub",
            },
          });
        }
        done(null, usuario);
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);

const router = Router();

router.get("/google", passport.authenticate("google", { session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/auth/login?error=google` }),
  (req, res) => {
    const user = req.user as any;
    const token = generateToken({ userId: user.id, email: user.email, rol: user.rol });
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

router.get("/github", passport.authenticate("github", { session: false }));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: `${FRONTEND_URL}/auth/login?error=github` }),
  (req, res) => {
    const user = req.user as any;
    const token = generateToken({ userId: user.id, email: user.email, rol: user.rol });
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

export default router;
