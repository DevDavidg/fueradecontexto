import { Navbar } from "@/components/molecules/navbar";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        {/* About Us */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                Sobre nosotros
              </p>
              <h1 className="mt-1 text-4xl font-semibold tracking-tight">
                Nuestra historia
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-neutral-300 leading-relaxed text-lg">
                  Sobre Nosotros Fueradecontexto nació en 2020, en plena
                  pandemia, de la mano de un padre y su hijo de 17 años. Lo que
                  comenzó como un proyecto familiar enfocado en remeras y buzos
                  personalizados, pronto fue tomando fuerza y consolidándose
                  como una marca con identidad propia. Con el paso del tiempo
                  fuimos ampliando nuestro catálogo: hoy también diseñamos
                  gorras, totebags y otros productos que acompañan tu estilo
                  diario. Cada pieza refleja nuestra pasión por lo auténtico, lo
                  creativo y lo diferente. Ya no nos vemos como un simple
                  “emprendimiento”: somos una marca en plena expansión, con la
                  mirada puesta en seguir creciendo, innovando y ofreciendo
                  productos que combinan calidad, diseño y personalidad. En
                  Fueradecontexto creemos que la moda es una forma de expresión,
                  y por eso cada prenda cuenta una historia. Queremos que la
                  tuya también se escriba con nosotros.
                </p>

                <div className="pt-6">
                  <h2 className="text-2xl font-medium text-[#ededed] mb-6">
                    Nuestros valores
                  </h2>
                  <ul className="space-y-4 text-neutral-300">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#ededed] rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <h3 className="font-medium text-[#ededed] mb-1">
                          Calidad artesanal
                        </h3>
                        <p className="text-sm text-neutral-400">
                          Cada detalle está cuidadosamente considerado para
                          garantizar la máxima calidad en nuestras prendas.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#ededed] rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <h3 className="font-medium text-[#ededed] mb-1">
                          Diseño sostenible
                        </h3>
                        <p className="text-sm text-neutral-400">
                          Nos comprometemos con prácticas responsables y
                          conscientes del medio ambiente.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#ededed] rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <h3 className="font-medium text-[#ededed] mb-1">
                          Expresión individual
                        </h3>
                        <p className="text-sm text-neutral-400">
                          Fomentamos la creatividad y la expresión personal sin
                          límites ni restricciones.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#ededed] rounded-full mt-2 flex-shrink-0"></span>
                      <div>
                        <h3 className="font-medium text-[#ededed] mb-1">
                          Transparencia
                        </h3>
                        <p className="text-sm text-neutral-400">
                          Mantenemos una comunicación abierta y honesta en cada
                          proceso de producción.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="aspect-square rounded-md bg-[#111111] border border-[#333333] grid place-items-center">
                  <span className="text-xs text-neutral-500 select-none">
                    FOTO DEL EQUIPO
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium text-[#ededed] mb-2">
                    Conoce a nuestro equipo
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Un grupo de diseñadores apasionados por crear moda que
                    trascienda las tendencias temporales.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission section */}
            <div className="mt-16 pt-12 border-t border-[#333333]">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-[#ededed] mb-6">
                  Nuestra misión
                </h2>
                <p className="text-lg text-neutral-300 leading-relaxed">
                  Crear una comunidad de personas que se atreven a ser
                  diferentes, que no temen expresar su individualidad a través
                  de la moda. Queremos ser la marca que te acompañe en tu camino
                  hacia la autenticidad.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
