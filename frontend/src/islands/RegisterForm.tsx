import { useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth, login } from "../stores/auth";
import { api } from "../lib/api";

export default function RegisterForm() {
  const [form, setForm] = useState({ email: "", password: "", nombre: "", apellido: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useStore($auth);

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
      const data = await api.auth.register(form);
      login(data.token, data.user);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message ?? "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      {error && (
        <div class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="nombre" class="mb-1.5 block text-sm font-medium text-text-secondary">Nombre</label>
          <input id="nombre" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} required
            class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
        </div>
        <div>
          <label for="apellido" class="mb-1.5 block text-sm font-medium text-text-secondary">Apellido</label>
          <input id="apellido" value={form.apellido} onChange={(e) => update("apellido", e.target.value)} required
            class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
        </div>
      </div>
      <div>
        <label for="email" class="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
        <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required
          class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
      </div>
      <div>
        <label for="password" class="mb-1.5 block text-sm font-medium text-text-secondary">Contraseña</label>
        <input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={6}
          class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
      </div>
      <button type="submit" disabled={loading}
        class="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
