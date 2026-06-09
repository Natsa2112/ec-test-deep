import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../stores/auth";

const API = import.meta.env.PUBLIC_API_URL;

export default function MisPedidos() {
  const auth = useStore($auth);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.token) { window.location.href = "/auth/login"; return; }
    fetch(`${API}/pedidos`, { headers: { Authorization: `Bearer ${auth.token}` } })
      .then((r) => r.json())
      .then(setPedidos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth.token]);

  if (loading) return <div class="flex justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  if (pedidos.length === 0) {
    return (
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <svg class="mb-4 h-16 w-16 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h2 class="mb-2 text-xl font-semibold text-text-primary">No tenés pedidos</h2>
        <a href="/productos" class="mt-4 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
          Comprar ahora
        </a>
      </div>
    );
  }

  return (
    <div class="space-y-4">
      {pedidos.map((p) => (
        <a key={p.id} href={`/pedido/${p.id}`}
          class="flex items-center justify-between rounded-xl border border-border bg-bg-secondary p-4 hover:border-violet-800/50 transition-colors"
        >
          <div>
            <p class="font-medium text-text-primary">{p.numeroPedido}</p>
            <p class="text-sm text-text-muted">{p.items?.length ?? 0} productos — ${Number(p.total).toLocaleString("es-AR")}</p>
          </div>
          <div class="text-right">
            <span class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              p.estado === "entregado" ? "bg-emerald-500/20 text-emerald-400" :
              p.estado === "cancelado" ? "bg-red-500/20 text-red-400" :
              "bg-amber-500/20 text-amber-400"
            }`}>
              {p.estado}
            </span>
            <p class="mt-1 text-xs text-text-muted">{new Date(p.creadoEn).toLocaleDateString("es-AR")}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
