import { useStore } from "@nanostores/react";
import { $auth, logout } from "../stores/auth";

export default function AuthButtons() {
  const auth = useStore($auth);

  if (auth.token && auth.user) {
    return (
      <div class="flex items-center gap-3">
        <a href="/perfil" class="flex items-center gap-2">
          {auth.user.avatarUrl ? (
            <img src={auth.user.avatarUrl} alt="" class="h-7 w-7 rounded-full" />
          ) : (
            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-medium text-white">
              {auth.user.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <span class="hidden text-sm text-text-secondary hover:text-violet-400 transition-colors md:block">
            {auth.user.nombre}
          </span>
        </a>
        {auth.user.rol === "admin" && (
          <a href="/admin" class="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-bg-elevated transition-colors">
            Admin
          </a>
        )}
        <button
          onClick={logout}
          class="rounded-lg p-2 text-text-secondary hover:bg-bg-elevated transition-colors"
          aria-label="Cerrar sesión"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div class="flex items-center gap-2">
      <a
        href="/auth/login"
        class="rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-violet-400 transition-colors"
      >
        Ingresar
      </a>
      <a
        href="/auth/register"
        class="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
      >
        Registrarse
      </a>
    </div>
  );
}
