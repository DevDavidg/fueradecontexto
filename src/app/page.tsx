import { Navbar } from "@/components/organisms/navbar";
import { ProductGrid } from "@/components/organisms/product-grid";
import { getSectionsContent } from "@/lib/sections-server";
import { HomeHeroSection } from "@/components/organisms/home-hero-section";
import { HomeStructuredData } from "@/components/seo/structured-data";

export default async function Home() {
  const sections = await getSectionsContent();
  const inicio = sections?.inicio;

  return (
    <>
      <HomeStructuredData />
      <div className="min-h-screen bg-black text-[#ededed]">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
          {/* Hero Section */}
          <section aria-labelledby="hero-heading">
            <HomeHeroSection />
          </section>

          {/* Featured Products Section */}
          <section aria-labelledby="products-heading" className="mt-12">
            <header className="mb-8">
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                {inicio?.secciones?.productos?.titulo ?? "Productos Destacados"}
              </p>
              <h1
                id="products-heading"
                className="mt-1 text-2xl font-semibold tracking-tight"
              >
                {inicio?.secciones?.productos?.subtitulo ?? "Catálogo Premium"}
              </h1>
              <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
                Descubre nuestra colección de ropa premium personalizable.
                Buzos, remeras, gorras y tote bags de alta calidad con opciones
                de personalización únicas.
              </p>
            </header>
            <ProductGrid />
          </section>

          {/* SEO Content Section */}
          <section aria-labelledby="about-heading" className="mt-16 py-8">
            <div className="prose prose-invert max-w-none">
              <h2 id="about-heading" className="text-xl font-semibold mb-4">
                Sobre Fueradecontexto
              </h2>
              <div className="text-sm text-neutral-300 space-y-3">
                <p>
                  En <strong>Fueradecontexto</strong> nos especializamos en
                  crear ropa premium de alta calidad con opciones de
                  personalización únicas. Nuestra colección incluye buzos,
                  remeras, gorras y tote bags diseñados para destacar tu estilo
                  personal.
                </p>
                <p>
                  Ofrecemos una amplia gama de colores y opciones de estampado
                  para que puedas crear piezas únicas que reflejen tu
                  personalidad. Todos nuestros productos están fabricados con
                  materiales de primera calidad y técnicas de impresión
                  profesionales.
                </p>
                <p>
                  Realizamos envíos a todo el país con opciones de
                  personalización que incluyen estampas, colores exclusivos y
                  talles desde S hasta XXL. Descubre por qué miles de clientes
                  eligen Fueradecontexto para su ropa personalizada.
                </p>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section aria-labelledby="categories-heading" className="mt-12">
            <h2 id="categories-heading" className="text-lg font-semibold mb-6">
              Categorías de Productos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900 rounded-lg p-4 text-center">
                <h3 className="font-medium text-sm mb-2">Buzos Premium</h3>
                <p className="text-xs text-neutral-400">
                  Con capucha y cuello redondo
                </p>
              </div>
              <div className="bg-neutral-900 rounded-lg p-4 text-center">
                <h3 className="font-medium text-sm mb-2">Remeras Básicas</h3>
                <p className="text-xs text-neutral-400">Algodón 100% premium</p>
              </div>
              <div className="bg-neutral-900 rounded-lg p-4 text-center">
                <h3 className="font-medium text-sm mb-2">
                  Gorras Personalizadas
                </h3>
                <p className="text-xs text-neutral-400">
                  Estampas y bordados únicos
                </p>
              </div>
              <div className="bg-neutral-900 rounded-lg p-4 text-center">
                <h3 className="font-medium text-sm mb-2">Tote Bags</h3>
                <p className="text-xs text-neutral-400">
                  Lona resistente y duradera
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
