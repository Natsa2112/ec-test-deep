import { useState } from "react";

const placeholderImages = [
  "https://via.placeholder.com/600x600?text=Producto+Vista+1",
  "https://via.placeholder.com/600x600?text=Producto+Vista+2",
  "https://via.placeholder.com/600x600?text=Producto+Vista+3",
  "https://via.placeholder.com/600x600?text=Producto+Vista+4",
];

export default function ImageGallery({ images = placeholderImages }: { images?: string[] }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border border-border bg-bg-secondary"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[selected] || images[0]}
          alt="Producto"
          loading="lazy"
          className="h-full w-full object-cover"
          style={
            zoomed
              ? {
                  transform: "scale(2)",
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
              i === selected
                ? "border-violet-500"
                : "border-border hover:border-violet-500/50"
            }`}
          >
            <img src={img} alt={`Vista ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
