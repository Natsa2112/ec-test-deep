import { useStore } from "@nanostores/react";
import { $auth } from "../stores/auth";
import { useState } from "react";
import { addToCart } from "../stores/cart";

interface Props {
  productoId: string;
  stock: number;
}

export default function AddToCartButton({ productoId, stock }: Props) {
  const auth = useStore($auth);
  const [cantidad, setCantidad] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(productoId, cantidad);
    setAdding(false);
  };

  if (stock === 0) {
    return (
      <button disabled class="flex-1 rounded-lg bg-bg-elevated px-6 py-2.5 text-sm font-medium text-text-muted cursor-not-allowed">
        Sin stock
      </button>
    );
  }

  return (
    <div class="flex gap-3">
      <div class="flex items-center rounded-lg border border-border">
        <button
          onClick={() => setCantidad((c) => Math.max(1, c - 1))}
          class="flex h-10 w-10 items-center justify-center text-text-secondary hover:bg-bg-elevated transition-colors"
        >-</button>
        <span class="flex h-10 w-12 items-center justify-center border-x border-border text-sm font-medium text-text-primary">
          {cantidad}
        </span>
        <button
          onClick={() => setCantidad((c) => Math.min(stock, c + 1))}
          class="flex h-10 w-10 items-center justify-center text-text-secondary hover:bg-bg-elevated transition-colors"
        >+</button>
      </div>
      <button
        onClick={handleAdd}
        disabled={adding}
        class="flex-1 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {adding ? "Agregando..." : auth.token ? "Agregar al carrito" : "Agregar al carrito"}
      </button>
    </div>
  );
}
