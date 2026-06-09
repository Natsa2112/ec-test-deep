import { atom } from "nanostores";
import { resetCart } from "./cart";

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: "cliente" | "admin";
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

function loadAuth(): AuthState {
  try {
    const stored = localStorage.getItem("techstore_auth");
    if (stored) return JSON.parse(stored);
  } catch {}
  return { token: null, user: null };
}

export const $auth = atom<AuthState>({ token: null, user: null });

export function initAuth() {
  const state = loadAuth();
  $auth.set(state);
}

export function login(token: string, user: User) {
  const state = { token, user };
  localStorage.setItem("techstore_auth", JSON.stringify(state));
  $auth.set(state);
}

export function logout() {
  localStorage.removeItem("techstore_auth");
  $auth.set({ token: null, user: null });
  resetCart();
}
