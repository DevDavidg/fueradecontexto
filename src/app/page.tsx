import { Navbar } from "@/components/molecules/navbar";
import { ProductGrid } from "@/components/organisms/product-grid";
import { LoadMoreCTA } from "@/components/molecules/load-more-cta";
import { getSectionsContent } from "@/lib/sections-server";
import { HomeHero } from "@/components/molecules/home-hero";

export default async function Home() {
  const sections = await getSectionsContent();
  const inicio = sections?.inicio;
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        {/* Hero */}
        <HomeHero />

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
          <div className="mt-6 flex items-center justify-center">
            <LoadMoreCTA />
          </div>
        </section>
        {/* (Secciones de categorías y tabla de talles se muestran en /products) */}
      </main>
    </div>
  );
}
