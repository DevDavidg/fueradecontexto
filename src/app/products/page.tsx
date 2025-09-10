import { Navbar } from "@/components/organisms/navbar";
import { ProductGrid } from "@/components/organisms/product-grid";
import { getSectionsContent } from "@/lib/sections-server";

export default async function ProductsPage() {
  const sections = await getSectionsContent();
  const productos = sections?.productos;
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            {productos?.titles?.tituloPrincipal ?? "Productos"}
          </h1>
          <p className="text-sm text-neutral-400">
            {productos?.titles?.subtitulo ?? "Catálogo de Fueradecontexto"}
          </p>
        </div>
        {/* Buzos */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            {productos?.categorias?.buzos?.titulo ?? "Buzos"}
          </h2>
          <p className="text-sm text-neutral-400">
            {productos?.categorias?.buzos?.descripcion ??
              "Buzos premium con capucha y cuello redondo"}
          </p>
          <div className="mt-4">
            <ProductGrid categoria="buzos" />
          </div>
        </section>

        {/* Camperas */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">
            {productos?.categorias?.camperas?.titulo ?? "Camperas"}
          </h2>
          <p className="text-sm text-neutral-400">
            {productos?.categorias?.camperas?.descripcion ??
              "Camperas premium de alta calidad"}
          </p>
          <div className="mt-4">
            <ProductGrid categoria="camperas" />
          </div>
        </section>

        {/* Gorras */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">
            {productos?.categorias?.gorras?.titulo ?? "Gorras"}
          </h2>
          <p className="text-sm text-neutral-400">
            {productos?.categorias?.gorras?.descripcion ??
              "Gorras premium de alta calidad"}
          </p>
          <div className="mt-4">
            <ProductGrid categoria="gorras" />
          </div>
        </section>

        {/* Totebags */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">
            {productos?.categorias?.totebags?.titulo ?? "Totebags"}
          </h2>
          <p className="text-sm text-neutral-400">
            {productos?.categorias?.totebags?.descripcion ??
              "Tote bags premium de lona resistente"}
          </p>
          <div className="mt-4">
            <ProductGrid categoria="totebags" />
          </div>
        </section>

        {/* Tabla de talles e información */}
        <section id="talles" className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">
            {productos?.tablaTalles?.titulo ?? "Tabla de talles"}
          </h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-[#333333]">
            <table className="w-full text-sm">
              <thead className="bg-[#111111] text-neutral-300">
                <tr>
                  <th className="p-3 text-left">Talle</th>
                  <th className="p-3 text-left">Ancho (cm)</th>
                  <th className="p-3 text-left">Largo (cm)</th>
                  <th className="p-3 text-left">Equivalencia</th>
                </tr>
              </thead>
              <tbody>
                {(productos?.tablaTalles?.medidas ?? []).map((r) => (
                  <tr key={r.talle} className="odd:bg-[#0b0b0b]">
                    <td className="p-3">{r.talle}</td>
                    <td className="p-3">{r.ancho}</td>
                    <td className="p-3">{r.largo}</td>
                    <td className="p-3">{r.equivalencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 text-sm text-neutral-400 list-disc pl-6 space-y-1">
            {(productos?.tablaTalles?.notas ?? []).map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
