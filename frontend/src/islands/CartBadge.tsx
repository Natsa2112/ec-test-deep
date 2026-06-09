import { useStore } from "@nanostores/react";
import { $cartCount, loadCart } from "../stores/cart";
import { useEffect } from "react";
import { $auth } from "../stores/auth";

export default function CartBadge() {
  const count = useStore($cartCount);
  const auth = useStore($auth);

  useEffect(() => {
    const unsub = $auth.subscribe(() => loadCart());
    return unsub;
  }, []);

  return (
    <a href="/carrito" class="relative rounded-lg p-2 text-text-secondary hover:bg-bg-elevated transition-colors" aria-label="Carrito">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      {count > 0 && (
        <span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </a>
  );
}
