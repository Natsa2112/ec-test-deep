export default function CarritoVacio() {
  return (
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <h2 class="text-xl font-semibold text-text-primary">Carrito vacío</h2>
      <p class="mt-2 text-sm text-text-muted">Agregá productos para empezar a comprar</p>
      <a href="/productos" class="mt-6 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
        Ver productos
      </a>
    </div>
  );
}
