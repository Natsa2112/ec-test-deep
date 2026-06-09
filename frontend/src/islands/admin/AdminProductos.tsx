import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $auth } from "../../stores/auth";

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  precio: string;
  stock: number;
  sku: string;
  marca: string;
  activo: boolean;
  descuento: number;
  categoria: { id: string; nombre: string };
}

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

const API = import.meta.env.PUBLIC_API_URL;

export default function AdminProductos() {
  const auth = useStore($auth);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({});

  const headers = { Authorization: `Bearer ${auth.token ?? ""}`, "Content-Type": "application/json" };

  const load = async () => {
    if (!auth.token) return;
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/admin/productos`, { headers }),
        fetch(`${API}/admin/categorias`, { headers }),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProductos(prodData.productos ?? []);
      setCategorias(catData ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [auth.token]);

  const openNew = () => {
    setEditing(null);
    setForm({ nombre: "", slug: "", precio: "", stock: 0, marca: "", sku: "", categoriaId: categorias[0]?.id ?? "" });
    setShowForm(true);
  };

  const openEdit = (p: Producto) => {
    setEditing(p);
    setForm({
      nombre: p.nombre, slug: p.slug, precio: p.precio, stock: p.stock,
      marca: p.marca ?? "", sku: p.sku ?? "", categoriaId: p.categoria?.id ?? "",
    });
    setShowForm(true);
  };

  const save = async () => {
    const body = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) };
    if (editing) {
      await fetch(`${API}/admin/productos/${editing.id}`, { method: "PUT", headers, body: JSON.stringify(body) });
    } else {
      await fetch(`${API}/admin/productos`, { method: "POST", headers, body: JSON.stringify(body) });
    }
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    await fetch(`${API}/admin/productos/${id}`, { method: "DELETE", headers });
    load();
  };

  if (loading) return <div class="flex justify-center py-10"><div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div>
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm text-text-muted">{productos.length} productos</p>
        <button onClick={openNew} class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
          + Nuevo producto
        </button>
      </div>

      {showForm && (
        <div class="mb-6 rounded-xl border border-border bg-bg-secondary p-6">
          <h3 class="mb-4 text-lg font-semibold text-text-primary">{editing ? "Editar" : "Nuevo"} producto</h3>
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
            <div>
              <label class="mb-1 block text-xs text-text-muted">Categoría</label>
              <select value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary">
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs text-text-muted">Precio</label>
              <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
                class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary" />
            </div>
            <div>
              <label class="mb-1 block text-xs text-text-muted">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary" />
            </div>
            <div>
              <label class="mb-1 block text-xs text-text-muted">Marca</label>
              <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
                class="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary" />
            </div>
            <div>
              <label class="mb-1 block text-xs text-text-muted">SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
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
              <th class="px-4 py-3 text-left font-medium text-text-muted">Categoría</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">SKU</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Precio</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Stock</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Marca</th>
              <th class="px-4 py-3 text-left font-medium text-text-muted">Estado</th>
              <th class="px-4 py-3 text-right font-medium text-text-muted">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {productos.map((p) => (
              <tr key={p.id} class="hover:bg-bg-secondary/50 transition-colors">
                <td class="px-4 py-3 font-medium text-text-primary">{p.nombre}</td>
                <td class="px-4 py-3 text-text-secondary">{p.categoria?.nombre ?? "-"}</td>
                <td class="px-4 py-3 text-text-muted">{p.sku ?? "-"}</td>
                <td class="px-4 py-3 text-text-primary">${Number(p.precio).toLocaleString("es-AR")}</td>
                <td class="px-4 py-3">
                  <span class={p.stock > 0 ? "text-emerald-400" : "text-red-400"}>{p.stock}</span>
                </td>
                <td class="px-4 py-3 text-text-secondary">{p.marca ?? "-"}</td>
                <td class="px-4 py-3">
                  <span class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.activo ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button onClick={() => openEdit(p)} class="mr-2 text-violet-400 hover:text-violet-300 transition-colors">Editar</button>
                  <button onClick={() => remove(p.id)} class="text-red-400 hover:text-red-300 transition-colors">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
