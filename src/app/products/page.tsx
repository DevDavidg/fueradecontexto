import { Navbar } from "@/components/molecules/navbar";
import { ProductGrid } from "@/components/organisms/product-grid";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm text-neutral-400">
            Catálogo de Fueradecontexto
          </p>
        </div>
        {/* Remeras */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight">Remeras</h2>
          <div className="mt-4">
            <ProductGrid />
          </div>
        </section>

        {/* Buzos */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Buzos</h2>
          <p className="text-sm text-neutral-400">Próximamente · Placeholder</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-[#333333] p-3 h-[320px] bg-[#111111] grid place-items-center text-neutral-500"
              >
                Placeholder
              </div>
            ))}
          </div>
        </section>

        {/* Gorras */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Gorras</h2>
          <p className="text-sm text-neutral-400">Próximamente · Placeholder</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-[#333333] p-3 h-[320px] bg-[#111111] grid place-items-center text-neutral-500"
              >
                Placeholder
              </div>
            ))}
          </div>
        </section>

        {/* Totebags */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Totebags</h2>
          <p className="text-sm text-neutral-400">Próximamente · Placeholder</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-[#333333] p-3 h-[320px] bg-[#111111] grid place-items-center text-neutral-500"
              >
                Placeholder
              </div>
            ))}
          </div>
        </section>

        {/* Tabla de talles e información */}
        <section id="talles" className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">
            Tabla de talles
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
                {[
                  { t: "S", a: 48, l: 67, e: "36-38" },
                  { t: "M", a: 51, l: 70, e: "38-40" },
                  { t: "L", a: 54, l: 73, e: "40-42" },
                  { t: "XL", a: 57, l: 76, e: "42-44" },
                ].map((r) => (
                  <tr key={r.t} className="odd:bg-[#0b0b0b]">
                    <td className="p-3">{r.t}</td>
                    <td className="p-3">{r.a}</td>
                    <td className="p-3">{r.l}</td>
                    <td className="p-3">{r.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 text-sm text-neutral-400 list-disc pl-6 space-y-1">
            <li>Las medidas pueden variar ±2 cm según el lote.</li>
            <li>Lavar con agua fría y del revés para preservar la estampa.</li>
            <li>Consulta cambios y devoluciones en la sección de ayuda.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
