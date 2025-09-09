"use client";

import { clsx } from "clsx";
import * as React from "react";

export type PlaceholderKind = "tee" | "hoodie" | "cap" | "totebag" | "default";

export type ProductLike = {
  id: string | number;
  name: string;
  tags?: string[];
};

const toKind = (product: ProductLike): PlaceholderKind => {
  const tags = (product.tags ?? []).map((t) => t.toLowerCase());
  if (tags.some((t) => ["hoodie", "buzo"].includes(t))) return "hoodie";
  if (tags.some((t) => ["tee", "remera", "t-shirt"].includes(t))) return "tee";
  if (tags.some((t) => ["cap", "gorra"].includes(t))) return "cap";
  if (tags.some((t) => ["tote", "totebag"].includes(t))) return "totebag";
  return "default";
};

const KIND_LABEL: Record<PlaceholderKind, string> = {
  tee: "Tee",
  hoodie: "Hoodie",
  cap: "Cap",
  totebag: "Totebag",
  default: "Producto",
};

const CommonTheme = {
  bg: "#0b0b0b",
  stroke: "#333333",
  accent: "#C2187A",
  ink: "#ededed",
} as const;

export type ProductPlaceholderSvgProps = {
  product: ProductLike;
  className?: string;
  kindOverride?: PlaceholderKind;
  // Toggle the footer label "<Kind> Img by Fueradecontexto"
  showAttribution?: boolean;
};

export const ProductPlaceholderSvg: React.FC<ProductPlaceholderSvgProps> = ({
  product,
  className,
  kindOverride,
  showAttribution = false,
}) => {
  const kind = kindOverride ?? toKind(product);
  const label = `${KIND_LABEL[kind]} Img by Fueradecontexto`;

  const id = React.useId();
  const gradId = `grad-${id}`;
  const patternId = `dots-${id}`;

  return (
    <svg
      viewBox="0 0 200 250"
      role="img"
      aria-label={`Placeholder ${kind} para ${product.name}`}
      data-kind={kind}
      className={clsx("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{product.name}</title>
      <desc>
        Imagen de relleno estilizada para {KIND_LABEL[kind]}. Solo contiene
        texto centrado para representar la ausencia de imagen.
      </desc>

      {/* Background gradient */}
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101010" />
          <stop offset="100%" stopColor={CommonTheme.bg} />
        </linearGradient>
        {/* Subtle dot pattern */}
        <pattern
          id={patternId}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="#151515" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="200" height="250" fill={`url(#${gradId})`} />
      <rect
        x="0"
        y="0"
        width="200"
        height="250"
        fill={`url(#${patternId})`}
        opacity="0.6"
      />

      {/* Centered text only */}
      <text
        x="100"
        y="125"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
        fontSize="18"
        fill={CommonTheme.ink}
        opacity="0.9"
      >
        IMG
      </text>

      {/* Footer label / watermark */}
      {showAttribution && (
        <g>
          {/* divider */}
          <line
            x1="16"
            x2="184"
            y1="210"
            y2="210"
            stroke="#1d1d1d"
            strokeWidth="1"
          />
          <text
            x="100"
            y="230"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
            fontSize="10"
            fill={CommonTheme.ink}
            opacity="0.8"
            aria-hidden="true"
          >
            {label}
          </text>
        </g>
      )}
    </svg>
  );
};
