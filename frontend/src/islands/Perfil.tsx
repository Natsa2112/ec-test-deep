import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth, login } from "../stores/auth";

const API = import.meta.env.PUBLIC_API_URL;

export default function Perfil() {
  const auth = useStore($auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");

  const headers = () => ({ Authorization: `Bearer ${auth.token ?? ""}`, "Content-Type": "application/json" });

  useEffect(() => {
    if (!auth.token) { window.location.href = "/auth/login"; return; }
    fetch(`${API}/usuarios/perfil`, { headers: headers() })
      .then((r) => r.json())
      .then((data) => {
        setNombre(data.nombre ?? "");
        setApellido(data.apellido ?? "");
        setTelefono(data.telefono ?? "");
      })
      .catch(() => setError("Error al cargar perfil"))
      .finally(() => setLoading(false));
  }, [auth.token]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API}/usuarios/perfil`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ nombre, apellido, telefono: telefono || null }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      const data = await res.json();
      login(auth.token!, { id: data.id, email: data.email, nombre: data.nombre, apellido: data.apellido, rol: data.rol });
      setEditing(false);
      setSuccess("Perfil actualizado correctamente");
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div class="flex justify-center py-20"><div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;
  }

  const initials = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  return (
    <div class="space-y-6">
      {error && (
        <div class="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
      )}
      {success && (
        <div class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">{success}</div>
      )}

      {/* Avatar & Email */}
      <div class="flex items-center gap-6 rounded-xl border border-border bg-bg-secondary p-6">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/20 text-xl font-bold text-violet-400">
          {initials}
        </div>
        <div>
          <p class="text-lg font-semibold text-text-primary">{nombre} {apellido}</p>
          <p class="text-sm text-text-muted">{auth.user?.email}</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          class="ml-auto rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-bg-elevated transition-colors"
        >
          {editing ? "Cancelar" : "Editar"}
        </button>
      </div>

      {/* Datos personales */}
      <div class="rounded-xl border border-border bg-bg-secondary p-6">
        <h2 class="mb-4 text-lg font-semibold text-text-primary">Datos personales</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-sm text-text-muted">Nombre</label>
              {editing ? (
                <input value={nombre} onChange={(e) => setNombre(e.target.value)}
                  class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary" />
              ) : (
                <p class="text-sm text-text-primary">{nombre}</p>
              )}
            </div>
            <div>
              <label class="mb-1 block text-sm text-text-muted">Apellido</label>
              {editing ? (
                <input value={apellido} onChange={(e) => setApellido(e.target.value)}
                  class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary" />
              ) : (
                <p class="text-sm text-text-primary">{apellido}</p>
              )}
            </div>
          </div>
          <div>
            <label class="mb-1 block text-sm text-text-muted">Email</label>
            <p class="text-sm text-text-secondary">{auth.user?.email}</p>
            <p class="text-xs text-text-muted mt-0.5">El email no se puede modificar</p>
          </div>
          <div>
            <label class="mb-1 block text-sm text-text-muted">Teléfono</label>
            {editing ? (
              <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+54 11 1234 5678"
                class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary" />
            ) : (
              <p class="text-sm text-text-primary">{telefono || <span class="text-text-muted">—</span>}</p>
            )}
          </div>
          <div>
            <label class="mb-1 block text-sm text-text-muted">Rol</label>
            <span class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              auth.user?.rol === "admin" ? "bg-violet-500/20 text-violet-400" : "bg-bg-elevated text-text-secondary"
            }`}>
              {auth.user?.rol === "admin" ? "Administrador" : "Cliente"}
            </span>
          </div>
        </div>

        {editing && (
          <div class="mt-6 flex gap-2">
            <button onClick={handleSave} disabled={saving}
              class="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <button onClick={() => setEditing(false)}
              class="rounded-lg border border-border px-5 py-2 text-sm text-text-secondary hover:bg-bg-elevated transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
