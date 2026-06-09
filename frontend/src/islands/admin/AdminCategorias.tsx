import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../../stores/auth";

const API = import.meta.env.PUBLIC_API_URL;

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  orden: number;
  activo: boolean;
  _count: { productos: number; hijos: number };
}

export default function AdminCategorias() {
  const auth = useStore($auth);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: "", slug: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const headers = { Authorization: `Bearer ${auth.token ?? ""}`, "Content-Type": "application/json" };

  const load = async () => {
    if (!auth.token) return;
    try {
      const res = await fetch(`${API}/admin/categorias`, { headers });
      setCategorias(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [auth.token]);

  const openNew = () => {
    setEditing(null);
    setForm({ nombre: "", slug: "" });
    setShowForm(true);
  };

  const openEdit = (c: Categoria) => {
    setEditing(c.id);
    setForm({ nombre: c.nombre, slug: c.slug });
    setShowForm(true);
  };

  const save = async () => {
    if (editing) {
      await fetch(`${API}/admin/categorias/${editing}`, { method: "PUT", headers, body: JSON.stringify(form) });
    } else {
      await fetch(`${API}/admin/categorias`, { method: "POST", headers, body: JSON.stringify(form) });
    }
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar categoría?")) return;
    await fetch(`${API}/admin/categorias/${id}`, { method: "DELETE", headers });
    load();
  };

  if (loading) return <div class="flex justify-center py-10"><div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div>
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm text-text-muted">{categorias.length} categorías</p>
        <button onClick={openNew} class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
          + Nueva categoría
        </button>
      </div>

      {showForm && (
        <div class="mb-6 rounded-xl border border-border bg-bg-secondary p-6">
          <h3 class="mb-4 text-lg font-semibold text-text-primary">{editing ? "Editar" : "Nueva"} categoría</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs text-text-muted">Nombre</label>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary" />
            </div>
            <div>
              <label class="mb-1 block text-xs text-text-muted">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary" />
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button onClick={save} class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
              {editing ? "Guardar" : "Crear"}
            </button>
            <button onClick={() => setShowForm(false)} class="rounded-lg bg-bg-elevated px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div class="overflow-x-auto rounded-xl border border-border">
        <table class="w-full text-sm">
          <thead class="bg-bg-secondary">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Nombre</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Slug</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Orden</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Productos</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Estado</th>
              <th class="px-4 py-3 text-right font-medium text-text-muted">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {categorias.map((c) => (
              <tr key={c.id} class="hover:bg-bg-secondary/50 transition-colors">
                <td class="px-4 py-3 font-medium text-text-primary">{c.nombre}</td>
                <td class="px-4 py-3 text-text-muted">{c.slug}</td>
                <td class="px-4 py-3 text-text-secondary">{c.orden}</td>
                <td class="px-4 py-3 text-text-secondary">{c._count.productos}</td>
                <td class="px-4 py-3">
                  <span class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.activo ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {c.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button onClick={() => openEdit(c)} class="mr-2 text-violet-400 hover:text-violet-300 transition-colors">Editar</button>
                  <button onClick={() => remove(c.id)} class="text-red-400 hover:text-red-300 transition-colors">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
