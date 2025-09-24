"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">
            ¡Nuevos productos disponibles!
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors"
          aria-label="Cerrar banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
