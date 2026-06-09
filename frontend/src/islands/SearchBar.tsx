import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../lib/api";

interface Suggestion {
  id: string;
  nombre: string;
  slug: string;
  precio: string;
  imagenes: string[];
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.productos.listar({ search: query, limit: "8" });
        setResults(res.productos.map((p) => ({ id: p.id, nombre: p.nombre, slug: p.slug, precio: p.precio, imagenes: p.imagenes })));
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && results[selectedIndex]) {
          window.location.href = `/producto/${results[selectedIndex].slug}`;
        } else if (query.trim()) {
          window.location.href = `/productos?search=${encodeURIComponent(query)}`;
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [results, selectedIndex, query],
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1); }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos..."
          className="w-full rounded-lg border border-border bg-bg-tertiary py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-text-muted border-t-transparent" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} className="absolute top-full z-50 mt-1 w-full rounded-lg border border-border bg-bg-tertiary py-1 shadow-lg">
          {results.map((item, i) => (
            <a
              key={item.id}
              href={`/producto/${item.slug}`}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                i === selectedIndex ? "bg-violet-600/20 text-violet-300" : "text-text-secondary hover:bg-bg-elevated"
              }`}
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-bg-elevated">
                {item.imagenes?.[0] && (
                  <img src={item.imagenes[0]} alt={item.nombre} loading="lazy" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-text-primary">{item.nombre}</p>
                <p className="text-xs text-violet-400">${parseInt(item.precio).toLocaleString("es-AR")}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
