import { Navbar } from "@/components/molecules/navbar";
import { ProductGrid } from "@/components/organisms/product-grid";
import { CheckoutSummary } from "@/components/organisms/checkout-summary";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 flex gap-6">
        <section className="flex-1">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Novedades</h1>
            <p className="text-sm text-neutral-600">
              Últimas piezas de Fueradecontexto
            </p>
          </div>
          <ProductGrid />
        </section>
        <CheckoutSummary />
      </main>
    </div>
  );
}
