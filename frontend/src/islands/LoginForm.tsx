import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $auth, login } from "../stores/auth";
import { api } from "../lib/api";
import { loadCart } from "../stores/cart";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useStore($auth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "social") setError("No se pudo autenticar con el proveedor seleccionado");
    else if (err === "token") setError("Error al procesar la autenticación");
  }, []);

  if (auth.token) {
    return (
      <div class="text-center">
        <p class="mb-4 text-text-primary">Ya iniciaste sesión como <strong>{auth.user?.nombre}</strong></p>
        <a href="/" class="text-violet-400 hover:text-violet-300">Volver al inicio</a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      login(data.token, data.user);
      await loadCart();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      {error && (
        <div class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
      <div>
        <label for="email" class="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label for="password" class="mb-1.5 block text-sm font-medium text-text-secondary">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          placeholder="••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
      <SocialLoginButtons />
      <p class="text-xs text-text-muted text-center">
        Demo: admin@techstore.com / cliente@test.com — password: password123
      </p>
    </form>
  );
}
