"use client";

import { Navbar } from "@/components/molecules/navbar";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <section className="py-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-neutral-400 animate-fadeIn">
              Sobre nosotros
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight animate-fadeInUp">
              Nuestra historia
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-neutral-200 animate-fadeInUp">
              Nacimos en 2020, en plena pandemia, como un proyecto entre madre e
              hijo de 17 años. Empezamos con remeras y buzos personalizados y,
              con el tiempo, evolucionamos en una marca con identidad propia.
              Hoy sumamos gorras, tote bags y piezas que acompañan el día a día
              sin perder autenticidad.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-neutral-200 animate-fadeInUp">
              Dejamos de vernos como un “emprendimiento”: somos una marca en
              expansión. Diseñamos con intención, producimos con criterio y
              cuidamos cada detalle para que cada prenda cuente algo de quien la
              usa.
            </p>
          </div>

          <div className="mt-12 border-t border-neutral-800" />

          <div className="mx-auto max-w-4xl">
            <div className="mt-10 space-y-12">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight animate-fadeInUp">
                  Misión
                </h2>
                <p className="text-neutral-300 leading-relaxed animate-fadeInUp">
                  Acompañar a quienes se atreven a ser diferentes con prendas
                  que expresan su identidad, priorizando calidad, comodidad y
                  mensaje.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight animate-fadeInUp">
                  Visión
                </h2>
                <p className="text-neutral-300 leading-relaxed animate-fadeInUp">
                  Ser una marca referente por su autenticidad y criterio
                  sostenible, inspirando a elegir con conciencia y estilo
                  propio.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight animate-fadeInUp">
                  Valores
                </h2>
                <p className="text-neutral-300 leading-relaxed animate-fadeInUp">
                  Creemos en la calidad como base de cada prenda, en el diseño
                  sostenible como compromiso, en la expresión individual como
                  motor creativo y en la transparencia como principio en cada
                  proceso.
                </p>
              </div>
            </div>

            <div className="mt-12 border-t border-neutral-800" />
          </div>
        </section>
      </main>
    </div>
  );
}
