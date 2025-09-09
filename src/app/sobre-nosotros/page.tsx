"use client";

import { Navbar } from "@/components/organisms/navbar";
import { useEffect, useState } from "react";
import type { SectionsContent } from "@/lib/sections-server";

export default function SobreNosotros() {
  const [content, setContent] = useState<
    SectionsContent["sobreNosotros"] | null
  >(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/sections", { cache: "no-store" });
      const json: SectionsContent = await res.json();
      setContent(json?.sobreNosotros ?? null);
    };
    load();
  }, []);

  const t = content?.titles;
  const historia = content?.historia;
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <section className="py-8">
          <div className="mx-auto max-w-4xl">
            {!content ? (
              <div className="animate-pulse">
                <div className="h-3 w-28 bg-neutral-800 rounded" />
                <div className="mt-3 h-8 w-64 bg-neutral-800 rounded" />
                <div className="mt-5 space-y-3">
                  <div className="h-5 w-full bg-neutral-900 rounded" />
                  <div className="h-5 w-5/6 bg-neutral-900 rounded" />
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-widest text-neutral-400 animate-fadeIn">
                  {t?.subtitulo ?? "Sobre nosotros"}
                </p>
                <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight animate-fadeInUp">
                  {t?.tituloPrincipal ?? "Nuestra historia"}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-neutral-200 animate-fadeInUp">
                  {historia?.parrafo1 ?? ""}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-neutral-200 animate-fadeInUp">
                  {historia?.parrafo2 ?? ""}
                </p>
              </>
            )}
          </div>

          <div className="mt-12 border-t border-neutral-800" />

          <div className="mx-auto max-w-4xl">
            <div className="mt-10 space-y-12">
              <div className="space-y-3">
                {!content ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 w-32 bg-neutral-800 rounded" />
                    <div className="h-4 w-5/6 bg-neutral-900 rounded" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold tracking-tight animate-fadeInUp">
                      {content?.mision?.titulo ?? "Misión"}
                    </h2>
                    <p className="text-neutral-300 leading-relaxed animate-fadeInUp">
                      {content?.mision?.descripcion ?? ""}
                    </p>
                  </>
                )}
              </div>
              <div className="space-y-3">
                {!content ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 w-28 bg-neutral-800 rounded" />
                    <div className="h-4 w-4/6 bg-neutral-900 rounded" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold tracking-tight animate-fadeInUp">
                      {content?.vision?.titulo ?? "Visión"}
                    </h2>
                    <p className="text-neutral-300 leading-relaxed animate-fadeInUp">
                      {content?.vision?.descripcion ?? ""}
                    </p>
                  </>
                )}
              </div>
              <div className="space-y-3">
                {!content ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 w-28 bg-neutral-800 rounded" />
                    <div className="h-4 w-3/6 bg-neutral-900 rounded" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold tracking-tight animate-fadeInUp">
                      {content?.valores?.titulo ?? "Valores"}
                    </h2>
                    <p className="text-neutral-300 leading-relaxed animate-fadeInUp">
                      {content?.valores?.descripcion ?? ""}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-12 border-t border-neutral-800" />
          </div>
        </section>
      </main>
    </div>
  );
}
