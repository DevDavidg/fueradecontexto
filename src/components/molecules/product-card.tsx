"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { ProductPlaceholderSvg } from "@/lib/placeholder-svg";
import { formatCurrency } from "@/lib/format-currency";
import { type Product, type ColorOption } from "@/lib/types";

export type ProductCardProps = {
  product: Product;
  onAdd?: (product: Product, options?: { color?: ColorOption }) => void;
  className?: string;
  highlight?: boolean;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAdd,
  className,
  highlight = true,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const [selectedColor, setSelectedColor] = React.useState<ColorOption | null>(
    product.customizable?.colors?.[0] ?? null
  );

  const accentHex = selectedColor?.hex ?? "#C2187A";
  const hexToRgb = (hex: string) => {
    const normalized = hex.replace("#", "");
    const bigint = parseInt(
      normalized.length === 3
        ? normalized
            .split("")
            .map((c) => c + c)
            .join("")
        : normalized,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };
  const { r, g, b } = hexToRgb(accentHex);
  const accentShadow = `rgba(${r}, ${g}, ${b}, 0.15)`;
  const cardStyle: React.CSSProperties & {
    ["--accent"]?: string;
    ["--accent-shadow"]?: string;
  } = {
    "--accent": accentHex,
    "--accent-shadow": accentShadow,
  };

  const isDisabled = !product.inStock;
  const discounted = Math.round(product.price * 0.9);

  const addToCart = () => {
    if (isDisabled) return;
    onAdd?.(product, { color: selectedColor ?? undefined });
  };

  const hasSvg = product.imageUrl.toLowerCase().endsWith(".svg");

  return (
    <div
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-[#333333]/60 bg-gradient-to-b from-[#0f0f0f] to-[#0b0b0b] backdrop-blur-sm",
        highlight &&
          "hover:border-[color:var(--accent)]/60 hover:shadow-[0_0_30px_var(--accent-shadow)] hover:scale-[1.02]",
        "transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-[color:var(--accent)]/50",
        // fade-in on mount to smooth skeleton → content transition
        isVisible ? "opacity-100" : "opacity-0",
        "transition-opacity",
        isDisabled && "opacity-75",
        className
      )}
      data-disabled={isDisabled || undefined}
      style={cardStyle}
    >
      <div className="relative w-full overflow-hidden rounded-t-2xl bg-gradient-to-b from-[#1a1a1a] to-[#111111] p-4">
        <div className="aspect-[4/5] relative">
          <Link
            href={`/products/${product.id}`}
            aria-label={`Ver ${product.name}`}
            className="relative block h-full w-full rounded-xl overflow-hidden group/image"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-10" />
            {!imageError && product.imageUrl ? (
              hasSvg ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={800}
                  height={1000}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover/image:scale-105"
                  onError={() => setImageError(true)}
                  priority={false}
                />
              ) : (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/image:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => setImageError(true)}
                  priority={false}
                />
              )
            ) : (
              <ProductPlaceholderSvg product={product} />
            )}
          </Link>
          {!product.inStock && (
            <div className="absolute inset-0 grid place-items-center bg-black/80 backdrop-blur-sm text-sm font-semibold text-[#ededed] rounded-xl">
              <div className="bg-red-600/20 border border-red-600/40 rounded-full px-4 py-2">
                Agotado
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-4">
        {product.customizable?.colors?.length ? (
          <fieldset
            className="flex items-center gap-2"
            aria-label="Colores disponibles"
          >
            <legend className="sr-only">Elegir color</legend>
            {product.customizable.colors.slice(0, 6).map((color) => {
              const selected = selectedColor?.name === color.name;
              return (
                <label key={color.name} className="inline-flex cursor-pointer">
                  <input
                    type="radio"
                    name={`color-${product.id}`}
                    className="peer sr-only"
                    checked={selected}
                    onChange={() => setSelectedColor(color)}
                  />
                  <span
                    className={clsx(
                      "h-5 w-5 rounded-full border-2 transition-all duration-200 hover:scale-110",
                      selected
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent)] ring-opacity-30 shadow-lg"
                        : "border-[#444444] hover:border-[#666666]"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Color ${color.name}`}
                  />
                </label>
              );
            })}
          </fieldset>
        ) : (
          // Reserve space to avoid height jump when some cards have colors and others do not
          <div className="h-5" aria-hidden />
        )}

        <div className="flex-1 min-h-0">
          <Link
            href={`/products/${product.id}`}
            className="block group/link"
            title={product.name}
          >
            <h3 className="text-base font-semibold text-[#ededed] leading-tight mb-3 group-hover/link:text-[#C2187A] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-white">
                {formatCurrency(product.price, product.currency ?? "ARS")}
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#C2187A]/10 to-transparent rounded-lg p-2 border border-[#C2187A]/20">
              <p className="text-sm font-medium text-[#C2187A] flex items-center gap-1">
                <span className="text-xs">💳</span>
                {formatCurrency(discounted, product.currency ?? "ARS")} con
                transferencia
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={addToCart}
          disabled={isDisabled}
          aria-label={isDisabled ? "Producto agotado" : "Agregar al carrito"}
          className={clsx(
            "w-full h-12 rounded-xl font-semibold text-sm transition-all duration-200",
            isDisabled
              ? "bg-[#333333] text-[#888888] cursor-not-allowed"
              : "bg-gradient-to-r from-[#C2187A] to-[#D63384] hover:from-[#D63384] hover:to-[#C2187A] text-white hover:shadow-[0_0_20px_rgba(194,24,122,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isDisabled ? "Agotado" : "Agregar al carrito"}
        </Button>
      </div>
    </div>
  );
};
