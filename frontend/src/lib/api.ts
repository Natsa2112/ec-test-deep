const API_BASE = import.meta.env.PUBLIC_API_URL ?? "/api";

export interface Producto {
  id: string;
  categoriaId: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: string;
  precioAnterior: string | null;
  stock: number;
  sku: string | null;
  marca: string | null;
  activo: boolean;
  destacado: boolean;
  enOferta: boolean;
  descuento: number;
  rating: string;
  imagenes: string[];
  createdAt: string;
  categoria: { nombre: string; slug: string };
  _count?: { resenas: number };
  especificaciones?: Especificacion[];
  resenas?: Resena[];
}

export interface Especificacion {
  id: string;
  atributo: string;
  valor: string;
}

export interface Resena {
  id: string;
  calificacion: number;
  comentario: string | null;
  creadoEn: string;
  usuario: { nombre: string; apellido: string };
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagenUrl: string | null;
  padreId: string | null;
  orden: number;
  hijos: Categoria[];
  _count: { productos: number };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductosResponse {
  productos: Producto[];
  pagination: Pagination;
}

export interface CategoriasResponse extends Array<Categoria> {}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers as Record<string, string>) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Productos
  productos: {
    listar: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return fetchApi<ProductosResponse>(`/productos${qs}`);
    },
    obtener: (slug: string) => fetchApi<Producto>(`/productos/${slug}`),
  },

  // Categorías
  categorias: {
    listar: () => fetchApi<CategoriasResponse>("/categorias"),
    obtener: (slug: string) => fetchApi<Categoria>(`/categorias/${slug}`),
  },

  // Auth
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { email: string; password: string; nombre: string; apellido: string }) =>
      fetchApi<{ token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Carrito
  carrito: {
    obtener: (token?: string) =>
      fetchApi<any>("/carrito", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    agregar: (productoId: string, cantidad?: number, token?: string) =>
      fetchApi<any>("/carrito/add", {
        method: "POST",
        body: JSON.stringify({ productoId, cantidad }),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
  },

  // Pedidos
  pedidos: {
    listar: (token: string) =>
      fetchApi<any>("/pedidos", { headers: { Authorization: `Bearer ${token}` } }),
    crear: (data: any, token: string) =>
      fetchApi<any>("/pedidos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${token}` },
      }),
  },

  // Usuario
  usuario: {
    perfil: (token: string) =>
      fetchApi<any>("/usuarios/perfil", { headers: { Authorization: `Bearer ${token}` } }),
  },

  // Reseñas
  resenas: {
    listar: (productoId: string) => fetchApi<any>(`/resenas/producto/${productoId}`),
    crear: (data: { productoId: string; calificacion: number; comentario?: string }, token: string) =>
      fetchApi<any>("/resenas", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${token}` },
      }),
  },
};
