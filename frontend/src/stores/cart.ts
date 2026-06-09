import { atom } from "nanostores";
import { api } from "../lib/api";
import { $auth } from "./auth";

export interface CartItem {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  producto: {
    id: string;
    nombre: string;
    slug: string;
    precio: number;
    imagenes: string[];
    stock: number;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  tokenSession?: string;
}

const CART_STORAGE_KEY = "techstore_cart_guest";

function loadGuestCart(): Cart {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { id: "", items: [] };
}

function saveGuestCart(cart: Cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {}
}

export const $cart = atom<Cart>({ id: "", items: [] });
export const $cartLoading = atom(false);
export const $cartCount = atom(0);

export async function loadCart() {
  $cartLoading.set(true);
  try {
    const auth = $auth.get();
    if (auth.token) {
      const data = await api.carrito.obtener(auth.token);
      $cart.set(data);
      $cartCount.set(data.items?.reduce((s: number, i: CartItem) => s + i.cantidad, 0) ?? 0);
    } else {
      const guest = loadGuestCart();
      $cart.set(guest);
      $cartCount.set(guest.items?.reduce((s: number, i: any) => s + i.cantidad, 0) ?? 0);
    }
  } catch {
    const guest = loadGuestCart();
    $cart.set(guest);
    $cartCount.set(guest.items?.reduce((s: number, i: any) => s + i.cantidad, 0) ?? 0);
  } finally {
    $cartLoading.set(false);
  }
}

export async function addToCart(productoId: string, cantidad = 1) {
  try {
    const auth = $auth.get();
    if (auth.token) {
      await api.carrito.agregar(productoId, cantidad, auth.token);
    } else {
      const guest = loadGuestCart();
      const existing = guest.items.find((i: any) => i.productoId === productoId);
      if (existing) {
        existing.cantidad += cantidad;
      } else {
        guest.items.push({ id: crypto.randomUUID(), productoId, cantidad, precioUnitario: 0, producto: { id: productoId, nombre: "", slug: "", precio: 0, imagenes: [], stock: 0 } });
      }
      saveGuestCart(guest);
    }
  } catch (err) {
    console.error("Error al agregar al carrito:", err);
  } finally {
    await loadCart();
  }
}

export function resetCart() {
  $cart.set({ id: "", items: [] });
  $cartCount.set(0);
  clearGuestCart();
}
