import { useState, useEffect } from "react";
import { api } from "../lib/api";

interface FilterSidebarProps {
  onFilter?: (filters: Filters) => void;
}

interface Filters {
  minPrice: string;
  maxPrice: string;
  marcas: string[];
  minRating: number;
  categoria: string;
}

const ratings = [5, 4, 3, 2, 1];

export default function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [categorias, setCategorias] = useState<{ nombre: string; slug: string; _count: { productos: number } }[]>([]);
  const [filters, setFilters] = useState<Filters>({ minPrice: "", maxPrice: "", marcas: [], minRating: 0, categoria: "" });
  const [marcas, setMarcas] = useState<string[]>([]);

  useEffect(() => {
    api.categorias.listar().then((cats) => {
      const flat = cats.flatMap((c) => [c, ...c.hijos]);
      setCategorias(flat);
      const uniqueMarcas = [...new Set(flat.map((c) => c.nombre))];
      setMarcas(uniqueMarcas.map((_, i) => `Marca ${i + 1}`));
    });
    api.productos.listar({ limit: "200" }).then((res) => {
      const unique = [...new Set(res.productos.filter((p) => p.marca).map((p) => p.marca!))];
      setMarcas(unique);
    });
  }, []);

  const toggleMarca = (marca: string) => {
    setFilters((f) => ({
      ...f,
      marcas: f.marcas.includes(marca) ? f.marcas.filter((m) => m !== marca) : [...f.marcas, marca],
    }));
  };

  const apply = () => {
    onFilter?.(filters);
  };

  const clear = () => {
    const cleared = { minPrice: "", maxPrice: "", marcas: [], minRating: 0, categoria: "" };
    setFilters(cleared);
    onFilter?.(cleared);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Filtros</h3>
        <button onClick={clear} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
          Limpiar
        </button>
      </div>

      {/* Categorías */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-secondary">Categoría</h4>
        <div className="space-y-1">
          {categorias.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setFilters((f) => ({ ...f, categoria: f.categoria === cat.slug ? "" : cat.slug }))}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                filters.categoria === cat.slug ? "bg-violet-600/20 text-violet-300" : "text-text-secondary hover:bg-bg-elevated"
              }`}
            >
              <span>{cat.nombre}</span>
              <span className="text-xs text-text-muted">({cat._count.productos})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-secondary">Precio</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
            className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none"
          />
          <span className="text-text-muted">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
            className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Marcas */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-secondary">Marca</h4>
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {marcas.map((marca) => (
            <label key={marca} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-bg-elevated transition-colors">
              <input
                type="checkbox"
                checked={filters.marcas.includes(marca)}
                onChange={() => toggleMarca(marca)}
                className="h-4 w-4 rounded border-border bg-bg-tertiary text-violet-600 focus:ring-violet-500"
              />
              {marca}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-secondary">Rating mínimo</h4>
        <div className="flex gap-1">
          {ratings.map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                filters.minRating === r ? "bg-violet-600 text-white" : "bg-bg-elevated text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {r}+
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={apply}
        className="w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
      >
        Aplicar filtros
      </button>
    </div>
  );
}
