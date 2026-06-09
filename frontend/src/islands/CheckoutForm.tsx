import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../stores/auth";
import { loadCart, $cart } from "../stores/cart";

const API = import.meta.env.PUBLIC_API_URL;

export default function CheckoutForm() {
  const auth = useStore($auth);
  const cart = useStore($cart);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [direccionId, setDireccionId] = useState("");
  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [metodoEnvio, setMetodoEnvio] = useState("standard");
  const [nuevaDireccion, setNuevaDireccion] = useState({
    alias: "Principal", direccion: "", ciudad: "", provincia: "", codigoPostal: "", pais: "Argentina",
  });
  const [showNewDir, setShowNewDir] = useState(false);
  const [pedidoId, setPedidoId] = useState("");

  const headers = { Authorization: `Bearer ${auth.token ?? ""}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!auth.token) { window.location.href = "/auth/login"; return; }
    loadCart();
    fetch(`${API}/usuarios/direcciones`, { headers })
      .then((r) => r.json())
      .then((data) => {
        setDirecciones(data);
        const principal = data.find((d: any) => d.esPrincipal);
        if (principal) setDireccionId(principal.id);
      })
      .catch(() => {});
  }, [auth.token]);

  const crearDireccion = async () => {
    const res = await fetch(`${API}/usuarios/direcciones`, {
      method: "POST", headers, body: JSON.stringify(nuevaDireccion),
    });
    if (res.ok) {
      const dir = await res.json();
      setDirecciones((prev) => [...prev, dir]);
      setDireccionId(dir.id);
      setShowNewDir(false);
    }
  };

  const crearPedido = async () => {
    if (!direccionId) { setError("Seleccioná una dirección de envío"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/pedidos`, {
        method: "POST",
        headers,
        body: JSON.stringify({ direccionEnvioId: direccionId, metodoPago, metodoEnvio }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al crear pedido");
      }
      const pedido = await res.json();
      setPedidoId(pedido.id);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.items?.reduce((s: number, i: any) => s + Number(i.precioUnitario) * i.cantidad, 0) ?? 0;
  const envio = subtotal >= 100000 ? 0 : 15000;
  const total = subtotal + envio;

  if (step === 3) {
    return (
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <svg class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="mb-2 text-2xl font-bold text-text-primary">¡Pedido creado con éxito!</h2>
        <p class="mb-6 text-text-muted">Te enviamos los detalles a tu email</p>
        <a href={`/pedido/${pedidoId}`} class="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
          Ver detalle del pedido
        </a>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-8">
        {/* Step 1: Dirección */}
        <div class="rounded-xl border border-border bg-bg-secondary p-6">
          <h2 class="mb-4 text-lg font-semibold text-text-primary">1. Dirección de envío</h2>
          {direcciones.length > 0 && !showNewDir ? (
            <div class="space-y-2">
              {direcciones.map((d) => (
                <label key={d.id} class={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                  direccionId === d.id ? "border-violet-500 bg-violet-500/10" : "border-border hover:bg-bg-elevated"
                }`}>
                  <input type="radio" name="direccion" checked={direccionId === d.id} onChange={() => setDireccionId(d.id)}
                    class="mt-0.5 h-4 w-4 text-violet-600" />
                  <div>
                    <p class="font-medium text-text-primary">{d.alias}</p>
                    <p class="text-sm text-text-secondary">{d.direccion}, {d.ciudad}, {d.provincia} — CP {d.codigoPostal}</p>
                  </div>
                </label>
              ))}
              <button onClick={() => setShowNewDir(true)} class="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                + Agregar nueva dirección
              </button>
            </div>
          ) : (
            <div class="space-y-3">
              <input placeholder="Alias (ej: Casa)" value={nuevaDireccion.alias} onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, alias: e.target.value })}
                class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary" />
              <input placeholder="Dirección" value={nuevaDireccion.direccion} onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, direccion: e.target.value })}
                class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary" />
              <div class="grid grid-cols-2 gap-3">
                <input placeholder="Ciudad" value={nuevaDireccion.ciudad} onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })}
                  class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary" />
                <input placeholder="Provincia" value={nuevaDireccion.provincia} onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, provincia: e.target.value })}
                  class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <input placeholder="Código postal" value={nuevaDireccion.codigoPostal} onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, codigoPostal: e.target.value })}
                  class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary" />
                <input placeholder="País" value={nuevaDireccion.pais} onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, pais: e.target.value })}
                  class="w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary" />
              </div>
              <div class="flex gap-2">
                <button onClick={crearDireccion} class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
                  Guardar dirección
                </button>
                {direcciones.length > 0 && (
                  <button onClick={() => setShowNewDir(false)} class="rounded-lg bg-bg-elevated px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Pago */}
        <div class="rounded-xl border border-border bg-bg-secondary p-6">
          <h2 class="mb-4 text-lg font-semibold text-text-primary">2. Método de pago</h2>
          <div class="space-y-2">
            {[
              { value: "mercadopago", label: "MercadoPago", desc: "Tarjetas, efectivo o saldo" },
              { value: "transferencia", label: "Transferencia bancaria", desc: "10% de descuento" },
              { value: "efectivo", label: "Efectivo (Rapipago/Pago Fácil)", desc: "Pagá en efectivo" },
            ].map((mp) => (
              <label key={mp.value} class={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                metodoPago === mp.value ? "border-violet-500 bg-violet-500/10" : "border-border hover:bg-bg-elevated"
              }`}>
                <input type="radio" name="pago" checked={metodoPago === mp.value} onChange={() => setMetodoPago(mp.value)}
                  class="h-4 w-4 text-violet-600" />
                <div>
                  <p class="font-medium text-text-primary">{mp.label}</p>
                  <p class="text-xs text-text-muted">{mp.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div class="rounded-xl border border-border bg-bg-secondary p-6">
          <h2 class="mb-4 text-lg font-semibold text-text-primary">3. Método de envío</h2>
          <div class="space-y-2">
            {[
              { value: "standard", label: "Envío estándar", desc: envio === 0 ? "Gratis" : `$${envio.toLocaleString("es-AR")} — 3-7 días` },
              { value: "express", label: "Envío express", desc: `$${(envio + 5000).toLocaleString("es-AR")} — 24-48 hs` },
            ].map((me) => (
              <label key={me.value} class={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                metodoEnvio === me.value ? "border-violet-500 bg-violet-500/10" : "border-border hover:bg-bg-elevated"
              }`}>
                <input type="radio" name="envio" checked={metodoEnvio === me.value} onChange={() => setMetodoEnvio(me.value)}
                  class="h-4 w-4 text-violet-600" />
                <div>
                  <p class="font-medium text-text-primary">{me.label}</p>
                  <p class="text-xs text-text-muted">{me.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
        )}
      </div>

      {/* Resumen sidebar */}
      <div class="lg:col-span-1">
        <div class="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 class="mb-4 text-lg font-semibold text-text-primary">Resumen</h3>
          <div class="space-y-3 text-sm">
            {cart.items?.slice(0, 4).map((item: any) => (
              <div key={item.id} class="flex justify-between text-text-secondary">
                <span class="truncate max-w-[180px]">{item.producto?.nombre}</span>
                <span>x{item.cantidad}</span>
              </div>
            ))}
            {(cart.items?.length ?? 0) > 4 && (
              <p class="text-xs text-text-muted">+{cart.items.length - 4} productos más</p>
            )}
            <div class="border-t border-border pt-3">
              <div class="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString("es-AR")}</span>
              </div>
              <div class="flex justify-between text-text-secondary">
                <span>Envío</span>
                <span>{envio === 0 ? <span class="text-emerald-400">Gratis</span> : `$${envio.toLocaleString("es-AR")}`}</span>
              </div>
              <div class="flex justify-between text-base font-bold text-text-primary pt-2">
                <span>Total</span>
                <span>${total.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>
          <button onClick={crearPedido} disabled={loading || !direccionId}
            class="mt-6 w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {loading ? "Procesando..." : "Confirmar compra"}
          </button>
        </div>
      </div>
    </div>
  );
}
