import { useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../stores/auth";

const API = import.meta.env.PUBLIC_API_URL;

export default function ContactForm() {
  const auth = useStore($auth);
  const [nombre, setNombre] = useState(auth.user?.nombre ?? "");
  const [apellido, setApellido] = useState(auth.user?.apellido ?? "");
  const [email, setEmail] = useState(auth.user?.email ?? "");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !mensaje.trim()) {
      setError("Completá todos los campos");
      return;
    }
    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      const res = await fetch(`${API}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, mensaje }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setEnviado(true);
    } catch {
      setError("Error al enviar. Intentalo de nuevo más tarde.");
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <svg class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="mb-2 text-xl font-bold text-text-primary">Mensaje enviado</h3>
        <p class="text-text-secondary">Te respondemos a la brevedad.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-4">
      {error && (
        <div class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
      )}
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="nombre" class="mb-1 block text-sm font-medium text-text-primary">Nombre</label>
          <input id="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)}
            class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
        </div>
        <div>
          <label for="apellido" class="mb-1 block text-sm font-medium text-text-primary">Apellido</label>
          <input id="apellido" required value={apellido} onChange={(e) => setApellido(e.target.value)}
            class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
        </div>
      </div>
      <div>
        <label for="email" class="mb-1 block text-sm font-medium text-text-primary">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
      </div>
      <div>
        <label for="mensaje" class="mb-1 block text-sm font-medium text-text-primary">Mensaje</label>
        <textarea id="mensaje" rows="5" required value={mensaje} onChange={(e) => setMensaje(e.target.value)}
          class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
      </div>
      <button type="submit" disabled={enviando}
        class="self-start rounded-lg bg-violet-600 px-8 py-3 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
        {enviando ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
