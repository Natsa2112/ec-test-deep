import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../../stores/auth";

const API = import.meta.env.PUBLIC_API_URL;

interface Stats {
  productos: number;
  usuarios: number;
  pedidos: number;
  ingresos: number;
  pedidosPendientes: number;
}

export default function AdminDashboard() {
  const auth = useStore($auth);
  const [stats, setStats] = useState<Stats>({ productos: 0, usuarios: 0, pedidos: 0, ingresos: 0, pedidosPendientes: 0 });
  const [recentPedidos, setRecentPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.token) return;
    Promise.all([
      fetch(`${API}/admin/productos?limit=1`, { headers: { Authorization: `Bearer ${auth.token}` } }).then((r) => r.json()),
      fetch(`${API}/admin/usuarios?limit=1`, { headers: { Authorization: `Bearer ${auth.token}` } }).then((r) => r.json()),
      fetch(`${API}/admin/pedidos?limit=5`, { headers: { Authorization: `Bearer ${auth.token}` } }).then((r) => r.json()),
    ]).then(([prodData, userData, pedidoData]) => {
      setStats({
        productos: prodData.pagination?.total ?? 0,
        usuarios: userData.pagination?.total ?? 0,
        pedidos: pedidoData.pagination?.total ?? 0,
        ingresos: pedidoData.pedidos?.reduce((s: number, p: any) => s + Number(p.total), 0) ?? 0,
        pedidosPendientes: pedidoData.pedidos?.filter((p: any) => p.estado === "pendiente").length ?? 0,
      });
      setRecentPedidos(pedidoData.pedidos ?? []);
    }).finally(() => setLoading(false));
  }, [auth.token]);

  if (loading) {
    return (
      <div class="flex items-center justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: "Productos", value: stats.productos, color: "border-l-violet-500" },
    { label: "Usuarios", value: stats.usuarios, color: "border-l-emerald-500" },
    { label: "Pedidos", value: stats.pedidos, color: "border-l-amber-500" },
    { label: "Pendientes", value: stats.pedidosPendientes, color: "border-l-red-500" },
    { label: "Ingresos", value: `$${stats.ingresos.toLocaleString("es-AR")}`, color: "border-l-violet-500" },
  ];

  return (
    <div class="space-y-8">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} class={`rounded-xl border border-border bg-bg-secondary border-l-4 ${card.color} p-4`}>
            <p class="text-xs font-medium text-text-muted uppercase tracking-wider">{card.label}</p>
            <p class="mt-1 text-2xl font-bold text-text-primary">{card.value}</p>
          </div>
        ))}
      </div>

      {recentPedidos.length > 0 && (
        <div>
          <h2 class="mb-4 text-lg font-semibold text-text-primary">Pedidos recientes</h2>
          <div class="overflow-x-auto rounded-xl border border-border">
            <table class="w-full text-sm">
              <thead class="bg-bg-secondary">
                <tr>
                  <th class="px-4 py-3 text-left font-medium text-text-muted">N° Pedido</th>
                  <th class="px-4 py-3 text-left font-medium text-text-muted">Cliente</th>
                  <th class="px-4 py-3 text-left font-medium text-text-muted">Total</th>
                  <th class="px-4 py-3 text-left font-medium text-text-muted">Estado</th>
                  <th class="px-4 py-3 text-left font-medium text-text-muted">Fecha</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                {recentPedidos.map((p: any) => (
                  <tr key={p.id} class="hover:bg-bg-secondary/50 transition-colors">
                    <td class="px-4 py-3 font-medium text-text-primary">{p.numeroPedido}</td>
                    <td class="px-4 py-3 text-text-secondary">{p.usuario?.nombre} {p.usuario?.apellido}</td>
                    <td class="px-4 py-3 text-text-primary">${Number(p.total).toLocaleString("es-AR")}</td>
                    <td class="px-4 py-3">
                      <span class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.estado === "entregado" ? "bg-emerald-500/20 text-emerald-400" :
                        p.estado === "cancelado" ? "bg-red-500/20 text-red-400" :
                        p.estado === "pendiente" ? "bg-amber-500/20 text-amber-400" :
                        "bg-violet-500/20 text-violet-400"
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-text-muted">{new Date(p.creadoEn).toLocaleDateString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
