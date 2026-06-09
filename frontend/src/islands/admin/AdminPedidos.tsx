import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../../stores/auth";

const API = import.meta.env.PUBLIC_API_URL;
const ESTADOS = ["pendiente", "confirmado", "pagado", "en_preparacion", "enviado", "entregado", "cancelado", "reembolsado"];

interface Pedido {
  id: string;
  numeroPedido: string;
  estado: string;
  total: string;
  creadoEn: string;
  usuario: { nombre: string; apellido: string; email: string };
  items: any[];
}

export default function AdminPedidos() {
  const auth = useStore($auth);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  const headers = { Authorization: `Bearer ${auth.token ?? ""}`, "Content-Type": "application/json" };

  const load = async () => {
    if (!auth.token) return;
    try {
      const qs = filtro ? `?estado=${filtro}` : "";
      const res = await fetch(`${API}/admin/pedidos${qs}`, { headers });
      const data = await res.json();
      setPedidos(data.pedidos ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [auth.token, filtro]);

  const cambiarEstado = async (id: string, estado: string) => {
    const res = await fetch(`${API}/admin/pedidos/${id}/estado`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ estado }),
    });
    if (res.ok) load();
  };

  if (loading) return <div class="flex justify-center py-10"><div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div>
      <div class="mb-4 flex items-center gap-3">
        <p class="text-sm text-text-muted">{pedidos.length} pedidos</p>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}
          class="rounded-lg border border-border bg-bg-tertiary px-3 py-1.5 text-sm text-text-primary">
          <option value="">Todos</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div class="overflow-x-auto rounded-xl border border-border">
        <table class="w-full text-sm">
          <thead class="bg-bg-secondary">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-text-muted">N° Pedido</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Cliente</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Items</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Total</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Estado</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Fecha</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Cambiar estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {pedidos.map((p) => (
              <tr key={p.id} class="hover:bg-bg-secondary/50 transition-colors">
                <td class="px-4 py-3 font-medium text-text-primary">{p.numeroPedido}</td>
                <td class="px-4 py-3 text-text-secondary">
                  {p.usuario?.nombre} {p.usuario?.apellido}
                  <br /><span class="text-xs text-text-muted">{p.usuario?.email}</span>
                </td>
                <td class="px-4 py-3 text-text-secondary">{p.items?.length ?? 0}</td>
                <td class="px-4 py-3 text-text-primary font-medium">${Number(p.total).toLocaleString("es-AR")}</td>
                <td class="px-4 py-3">
                  <span class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.estado === "entregado" ? "bg-emerald-500/20 text-emerald-400" :
                    p.estado === "cancelado" || p.estado === "reembolsado" ? "bg-red-500/20 text-red-400" :
                    p.estado === "pendiente" ? "bg-amber-500/20 text-amber-400" :
                    "bg-violet-500/20 text-violet-400"
                  }`}>
                    {p.estado}
                  </span>
                </td>
                <td class="px-4 py-3 text-text-muted">{new Date(p.creadoEn).toLocaleDateString("es-AR")}</td>
                <td class="px-4 py-3">
                  <select
                    value={p.estado}
                    onChange={(e) => cambiarEstado(p.id, e.target.value)}
                    class="rounded-lg border border-border bg-bg-tertiary px-2 py-1 text-xs text-text-primary"
                  >
                    {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
