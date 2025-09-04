import { Navbar } from "@/components/molecules/navbar";
import { ProductGrid } from "@/components/organisms/product-grid";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm text-neutral-600">
            Catálogo de Fueradecontexto
          </p>
        </div>
        <ProductGrid />
      </main>
    </div>
  );
}
