import { Navbar } from "@/components/organisms/navbar";
import { ProductGrid } from "@/components/organisms/product-grid";
// LoadMoreCTA ahora lo usa ProductGrid internamente
import { getSectionsContent } from "@/lib/sections-server";
import { HomeHeroSection } from "@/components/organisms/home-hero-section";

export default async function Home() {
  const sections = await getSectionsContent();
  const inicio = sections?.inicio;
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        {/* Hero */}
        <HomeHeroSection />

        {/* Productos */}
        <section>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              {inicio?.secciones?.productos?.titulo ?? "Productos"}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {inicio?.secciones?.productos?.subtitulo ?? "Remeras"}
            </h1>
          </div>
          <ProductGrid />
          {/* LoadMoreCTA se renderiza dentro de ProductGrid */}
        </section>
        {/* (Secciones de categorías y tabla de talles se muestran en /products) */}
      </main>
    </div>
  );
}
