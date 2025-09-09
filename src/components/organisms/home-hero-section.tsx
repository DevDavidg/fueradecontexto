"use client";

import { useEffect, useState } from "react";
import type { SectionsContent } from "@/lib/sections-server";
import { HomeHero } from "@/components/molecules/home-hero";

export const HomeHeroSection = () => {
  const [inicio, setInicio] = useState<SectionsContent["inicio"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/sections", { cache: "no-store" });
        const json: SectionsContent = await res.json();
        setInicio(json?.inicio ?? null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <HomeHero
      isLoading={loading}
      title={inicio?.secciones?.hero?.titulo}
      description={inicio?.secciones?.hero?.descripcion}
    />
  );
};
