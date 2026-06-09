import { useStore } from "@nanostores/react";
import { $auth } from "../../stores/auth";

const links = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/productos", label: "Productos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/admin/categorias", label: "Categorías", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
];

export default function AdminSidebar() {
  const auth = useStore($auth);
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <nav class="space-y-1">
      <div class="mb-4 px-3">
        <p class="text-sm font-semibold text-text-primary">Admin</p>
        <p class="text-xs text-text-muted truncate">{auth.user?.nombre} {auth.user?.apellido}</p>
      </div>
      {links.map((link) => {
        const active = path === link.href || (link.href !== "/admin" && path.startsWith(link.href));
        return (
          <a
            key={link.href}
            href={link.href}
            class={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-violet-600/20 text-violet-300" : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
            }`}
          >
            <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={link.icon} />
            </svg>
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
