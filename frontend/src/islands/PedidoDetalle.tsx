import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../stores/auth";

const API = import.meta.env.PUBLIC_API_URL;

export default function PedidoDetalle() {
  const auth = useStore($auth);
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "";

  useEffect(() => {
    if (!auth.token || !id) return;
    fetch(`${API}/pedidos/${id}`, { headers: { Authorization: `Bearer ${auth.token}` } })
      .then((r) => r.json())
      .then(setPedido)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth.token, id]);

  if (loading) return <div class="flex justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;
  if (!pedido) return <p class="text-center py-20 text-text-muted">Pedido no encontrado</p>;

  const estadoColors: Record<string, string> = {
    pendiente: "bg-amber-500/20 text-amber-400",
    confirmado: "bg-violet-500/20 text-violet-400",
    pagado: "bg-emerald-500/20 text-emerald-400",
    en_preparacion: "bg-blue-500/20 text-blue-400",
    enviado: "bg-indigo-500/20 text-indigo-400",
    entregado: "bg-emerald-500/20 text-emerald-400",
    cancelado: "bg-red-500/20 text-red-400",
    reembolsado: "bg-orange-500/20 text-orange-400",
  };

  return (
    <div class="mx-auto max-w-3xl px-4 py-8">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-text-primary">Pedido {pedido.numeroPedido}</h1>
          <span class={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${estadoColors[pedido.estado] ?? "bg-bg-elevated text-text-muted"}`}>
            {pedido.estado}
          </span>
        </div>
        <p class="text-sm text-text-muted">{new Date(pedido.creadoEn).toLocaleDateString("es-AR", { dateStyle: "long" })}</p>
      </div>

      <div class="space-y-6">
        {/* Items */}
        <div class="rounded-xl border border-border">
          <div class="border-b border-border bg-bg-secondary px-6 py-3">
            <h2 class="font-semibold text-text-primary">Productos</h2>
          </div>
          <div class="divide-y divide-border">
            {pedido.items?.map((item: any) => (
              <div key={item.id} class="flex items-center justify-between px-6 py-4">
                <div class="flex items-center gap-3">
                  {item.producto?.imagenes?.[0] && (
                    <img src={item.producto.imagenes[0]} alt={item.nombreProducto} loading="lazy" class="h-12 w-12 rounded-lg bg-bg-elevated object-cover" />
                  )}
                  <div>
                    <a href={`/producto/${item.producto?.slug}`} class="text-sm font-medium text-text-primary hover:text-violet-400 transition-colors">
                      {item.nombreProducto}
                    </a>
                    <p class="text-xs text-text-muted">${Number(item.precioUnitario).toLocaleString("es-AR")} x {item.cantidad}</p>
                  </div>
                </div>
                <p class="text-sm font-medium text-text-primary">${Number(item.subtotal).toLocaleString("es-AR")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div class="rounded-xl border border-border bg-bg-secondary p-6">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-text-secondary">
              <span>Subtotal</span><span>${Number(pedido.subtotal).toLocaleString("es-AR")}</span>
            </div>
            <div class="flex justify-between text-text-secondary">
              <span>Envío</span><span>{Number(pedido.envioCosto) === 0 ? <span class="text-emerald-400">Gratis</span> : `$${Number(pedido.envioCosto).toLocaleString("es-AR")}`}</span>
            </div>
            {Number(pedido.descuento) > 0 && (
              <div class="flex justify-between text-red-400">
                <span>Descuento</span><span>-$${Number(pedido.descuento).toLocaleString("es-AR")}</span>
              </div>
            )}
            <div class="flex justify-between text-base font-bold text-text-primary border-t border-border pt-2">
              <span>Total</span><span>$${Number(pedido.total).toLocaleString("es-AR")}</span>
            </div>
          </div>
        </div>

        {/* Historial */}
        {pedido.historial?.length > 0 && (
          <div class="rounded-xl border border-border">
            <div class="border-b border-border bg-bg-secondary px-6 py-3">
              <h2 class="font-semibold text-text-primary">Historial</h2>
            </div>
            <div class="divide-y divide-border">
              {pedido.historial.map((h: any) => (
                <div key={h.id} class="flex items-center justify-between px-6 py-3 text-sm">
                  <span class="text-text-secondary">{h.estado}{h.comentario ? ` — ${h.comentario}` : ""}</span>
                  <span class="text-text-muted">{new Date(h.creadoEn).toLocaleString("es-AR")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pedido.direccionEnvio && (
          <div class="rounded-xl border border-border bg-bg-secondary p-6">
            <h2 class="mb-2 font-semibold text-text-primary">Dirección de envío</h2>
            <p class="text-sm text-text-secondary">{pedido.direccionEnvio.direccion}</p>
            <p class="text-sm text-text-secondary">{pedido.direccionEnvio.ciudad}, {pedido.direccionEnvio.provincia}</p>
            <p class="text-sm text-text-secondary">CP {pedido.direccionEnvio.codigoPostal}</p>
          </div>
        )}
      </div>
    </div>
  );
}
