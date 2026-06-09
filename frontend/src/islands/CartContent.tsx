import { useStore } from "@nanostores/react";
import { $cart, $cartLoading, $cartCount, loadCart, addToCart } from "../stores/cart";
import { $auth } from "../stores/auth";
import { useEffect } from "react";

export default function CartContent() {
  const cart = useStore($cart);
  const loading = useStore($cartLoading);
  const auth = useStore($auth);

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return (
      <div class="flex items-center justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <svg class="mb-4 h-20 w-20 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 class="mb-2 text-xl font-semibold text-text-primary">Tu carrito está vacío</h2>
        <p class="mb-6 text-sm text-text-muted">Agregá productos para empezar a comprar</p>
        <a href="/productos" class="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
          Ver productos
        </a>
      </div>
    );
  }

  const subtotal = cart.items.reduce((s, i) => s + Number(i.precioUnitario) * i.cantidad, 0);
  const envio = subtotal >= 100000 ? 0 : 15000;
  const total = subtotal + envio;

  return (
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <div class="divide-y divide-border rounded-xl border border-border">
          {cart.items.map((item) => (
            <div key={item.id} class="flex gap-4 p-4">
              <div class="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-elevated">
                {item.producto?.imagenes?.[0] && (
                  <img src={item.producto.imagenes[0]} alt={item.producto.nombre} loading="lazy" class="h-full w-full object-cover" />
                )}
              </div>
              <div class="flex flex-1 flex-col justify-between">
                <div>
                  <a href={`/producto/${item.producto.slug}`} class="text-sm font-medium text-text-primary hover:text-violet-400 transition-colors">
                    {item.producto.nombre}
                  </a>
                  <p class="text-xs text-text-muted">${Number(item.precioUnitario).toLocaleString("es-AR")} c/u</p>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center rounded-lg border border-border">
                    <button
                      onClick={async () => {
                        if (item.cantidad > 1) {
                          const api = await import("../lib/api").then((m) => m.api);
                          try {
                            await api.carrito.agregar(item.productoId, -1, auth.token ?? undefined);
                            await loadCart();
                          } catch {}
                        }
                      }}
                      class="flex h-8 w-8 items-center justify-center text-text-secondary hover:bg-bg-elevated transition-colors"
                    >-</button>
                    <span class="flex h-8 w-10 items-center justify-center border-x border-border text-sm font-medium text-text-primary">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={async () => {
                        await addToCart(item.productoId, 1);
                      }}
                      class="flex h-8 w-8 items-center justify-center text-text-secondary hover:bg-bg-elevated transition-colors"
                    >+</button>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-bold text-text-primary">
                      ${(Number(item.precioUnitario) * item.cantidad).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 class="mb-4 text-lg font-semibold text-text-primary">Resumen</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString("es-AR")}</span>
            </div>
            <div class="flex justify-between text-text-secondary">
              <span>Envío</span>
              <span>{envio === 0 ? <span class="text-emerald-400">Gratis</span> : `$${envio.toLocaleString("es-AR")}`}</span>
            </div>
            <div class="border-t border-border pt-3">
              <div class="flex justify-between text-base font-bold text-text-primary">
                <span>Total</span>
                <span>${total.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </div>
          {auth.token ? (
            <a
              href="/checkout"
              class="mt-6 block w-full rounded-lg bg-violet-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
              Iniciar compra
            </a>
          ) : (
            <a
              href="/auth/login"
              class="mt-6 block w-full rounded-lg bg-violet-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
              Iniciar sesión para comprar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
