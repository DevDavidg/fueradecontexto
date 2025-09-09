"use client";

import { useEffect, useState } from "react";
import type { SectionsContent } from "@/lib/sections-server";

export const HomeHero = () => {
  const [inicio, setInicio] = useState<SectionsContent["inicio"] | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/sections", { cache: "no-store" });
      const json: SectionsContent = await res.json();
      setInicio(json?.inicio ?? null);
    };
    load();
  }, []);

  return (
    <section className="py-6">
      <div className="mx-auto max-w-3xl">
        <div className="relative z-0 w-full aspect-[16/9] rounded-md bg-[#111111] border border-[#333333] grid place-items-center">
          {!inicio ? (
            <div className="h-6 w-24 bg-neutral-800 rounded animate-pulse" />
          ) : (
            <span className="text-xs text-neutral-500 select-none">
              {inicio?.secciones?.hero?.titulo ?? "IMG"}
            </span>
          )}
        </div>
        <p className="mt-4 text-center text-lg font-medium tracking-wide text-neutral-200 uppercase">
          {!inicio ? (
            <span className="inline-block h-5 w-5/6 bg-neutral-800 rounded animate-pulse" />
          ) : (
            inicio?.secciones?.hero?.descripcion ??
            "No seguimos tendencias, creamos prendas que cuentan tu historia"
          )}
        </p>
      </div>
      <div className="mt-6 border-t border-[#333333]" />
    </section>
  );
};
