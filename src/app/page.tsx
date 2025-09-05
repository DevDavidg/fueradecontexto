import { Navbar } from "@/components/molecules/navbar";
import { ProductGrid } from "@/components/organisms/product-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        {/* Hero */}
        <section className="py-6">
          <div className="mx-auto max-w-3xl">
            <div className="relative z-0 w-full aspect-[16/9] rounded-md bg-[#111111] border border-[#333333] grid place-items-center">
              <span className="text-xs text-neutral-500 select-none">IMG</span>
            </div>
            <p className="mt-3 text-center text-xs tracking-wide text-neutral-400 uppercase">
              Frase motivadora
            </p>
          </div>
          <div className="mt-6 border-t border-[#333333]" />
        </section>

        {/* Productos */}
        <section>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              Productos
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Remeras
            </h1>
          </div>
          <ProductGrid />
          <div className="mt-6 flex items-center justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-[#C2187A] hover:bg-pink-700 text-sm"
              aria-label="Llamado a la acción principal"
            >
              CTA
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
