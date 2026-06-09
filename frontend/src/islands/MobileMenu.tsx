import { useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth, logout } from "../stores/auth";

export default function MobileMenu() {
  const auth = useStore($auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} class="flex items-center p-2 text-text-secondary hover:text-violet-400 md:hidden transition-colors" aria-label="Abrir menú">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div class="fixed inset-0 z-50 md:hidden">
          <div class="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div class="absolute right-0 top-0 h-full w-72 bg-bg-secondary border-l border-border p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-8">
              <span class="text-lg font-bold text-violet-400">TechStore</span>
              <button onClick={() => setOpen(false)} class="p-1 text-text-secondary hover:text-text-primary transition-colors" aria-label="Cerrar menú">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav class="flex flex-col gap-2">
              <a href="/productos" onClick={() => setOpen(false)} class="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-violet-400 transition-colors">Productos</a>
              <a href="/ofertas" onClick={() => setOpen(false)} class="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-violet-400 transition-colors">Ofertas</a>
              <a href="/nosotros" onClick={() => setOpen(false)} class="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-violet-400 transition-colors">Nosotros</a>
              <a href="/contacto" onClick={() => setOpen(false)} class="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-violet-400 transition-colors">Contacto</a>
              <hr class="my-2 border-border" />
              {auth.token ? (
                <>
                  <a href="/perfil" onClick={() => setOpen(false)} class="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-violet-400 transition-colors">Mi perfil</a>
                  <a href="/mis-pedidos" onClick={() => setOpen(false)} class="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-violet-400 transition-colors">Mis pedidos</a>
                  {auth.user?.rol === "admin" && (
                    <a href="/admin" onClick={() => setOpen(false)} class="rounded-lg px-4 py-3 text-sm font-medium text-violet-400 hover:bg-bg-elevated transition-colors">Admin</a>
                  )}
                  <button onClick={() => { logout(); setOpen(false); }} class="rounded-lg px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-bg-elevated transition-colors">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <a href="/auth/login" onClick={() => setOpen(false)} class="rounded-lg px-4 py-3 text-sm font-medium text-violet-400 hover:bg-bg-elevated transition-colors">Ingresar</a>
                  <a href="/auth/register" onClick={() => setOpen(false)} class="rounded-lg bg-violet-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-violet-500 transition-colors">Registrarse</a>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
