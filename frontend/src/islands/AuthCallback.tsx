import { useEffect } from "react";
import { login } from "../stores/auth";
import { loadCart } from "../stores/cart";

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      window.location.href = "/auth/login?error=social";
      return;
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        login(token, {
          id: payload.userId,
          email: payload.email,
          nombre: payload.nombre ?? "",
          apellido: payload.apellido ?? "",
          avatarUrl: payload.avatarUrl ?? null,
          rol: payload.rol,
        });
        loadCart().then(() => {
          window.location.href = "/";
        });
      } catch {
        window.location.href = "/auth/login?error=token";
      }
    }
  }, []);

  return (
    <div class="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-16">
      <div class="text-center">
        <div class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
        <p class="text-text-muted">Autenticando...</p>
      </div>
    </div>
  );
}
