"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { ProductPlaceholderSvg } from "@/components/ui/placeholder-svg";
import { HeartIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/format-currency";
import { type Product, type ColorOption, type StampOption } from "@/lib/types";
import { useFavorites } from "@/hooks/use-favorites";
import { StampSelector } from "@/components/molecules/stamp-selector";

const COMPOUND_COLOR_MAP: Record<string, { color1: string; color2: string }> = {
  "Negro Blanca": { color1: "#000000", color2: "#FFFFFF" },
  "Gris Blanco": { color1: "#808080", color2: "#FFFFFF" },
  "Azul Roja Blanca": { color1: "#2563EB", color2: "#DC2626" },
  "Azul Beige Roja": { color1: "#2563EB", color2: "#F5DEB3" },
  "Verde Militar Blanca": { color1: "#166534", color2: "#FFFFFF" },
  "Violeta Blanca": { color1: "#7C3AED", color2: "#FFFFFF" },
};

const getCompoundColors = (
  colorName: string
): { color1: string; color2: string } => {
  return (
    COMPOUND_COLOR_MAP[colorName] || { color1: "#000000", color2: "#FFFFFF" }
  );
};

const CompoundColorBadge: React.FC<{
  colorName: string;
  selected: boolean;
}> = ({ colorName, selected }) => {
  const { color1, color2 } = getCompoundColors(colorName);

  return (
    <div
      className={clsx(
        "h-5 w-5 rounded-full border transition relative overflow-hidden",
        selected
          ? "border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/20"
          : "border-neutral-700 hover:border-neutral-600"
      )}
      title={colorName}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${color1} 0%, ${color1} 50%, ${color2} 50%, ${color2} 100%)`,
        }}
      />
    </div>
  );
};

export type ProductCardProps = {
  product: Product;
  onAdd?: (
    product: Product,
    options?: { color?: ColorOption; stampOption?: StampOption }
  ) => void;
  className?: string;
  highlight?: boolean;
};

const getImageForColor = (product: Product, colorName?: string): string => {
  if (!product.product_images || product.product_images.length === 0) {
    return "/placeholder-product.png";
  }

  // If no color is specified, return the first image
  if (!colorName) {
    return product.product_images[0]?.url || "/placeholder-product.png";
  }

  // Find image for the specific color
  const colorImage = product.product_images.find(
    (img) => img.color.toLowerCase() === colorName.toLowerCase()
  );

  return (
    colorImage?.url ||
    product.product_images[0]?.url ||
    "/placeholder-product.png"
  );
};

const isCompoundColor = (product: Product, colorName: string): boolean => {
  return (
    product.categoria === "gorras" &&
    (colorName.includes("Blanca") ||
      colorName.includes("Beige") ||
      colorName.includes("Militar"))
  );
};

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  function ProductCard({ product, onAdd, className, highlight = true }) {
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    const [imageError, setImageError] = React.useState(false);
    const [validColors, setValidColors] = React.useState<ColorOption[]>(
      product.customizable?.colors || []
    );
    const [selectedColor, setSelectedColor] =
      React.useState<ColorOption | null>(
        product.customizable?.colors?.[0] || null
      );
    const [selectedStampOption, setSelectedStampOption] =
      React.useState<StampOption | null>(null);

    React.useEffect(() => {
      // Set valid colors based on available product images
      if (product.customizable?.colors && product.product_images) {
        const validColorsResult = product.customizable.colors.filter((color) =>
          product.product_images?.some(
            (img) => img.color.toLowerCase() === color.name.toLowerCase()
          )
        );

        setValidColors(validColorsResult);

        // If current selected color is not valid, select the first valid color
        if (
          selectedColor &&
          !validColorsResult.find((c) => c.name === selectedColor.name)
        ) {
          setSelectedColor(validColorsResult[0] || null);
        }
      } else {
        setValidColors(product.customizable?.colors || []);
      }
    }, [product, selectedColor]);

    React.useEffect(() => setImageError(false), [selectedColor]);

    const isDisabled = !product.inStock;
    const isFav = isFavorite(product.id);
    const accentHex = "#e12afb"; // Always use fixed pink color
    const stampExtraCost = selectedStampOption?.extraCost || 0;
    const totalPrice = product.price + stampExtraCost;
    const discounted = Math.round(totalPrice * 0.9);

    const imageUrl = React.useMemo(() => {
      return getImageForColor(product, selectedColor?.name);
    }, [product, selectedColor]);

    const toggleFavorite = React.useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFav) {
          removeFromFavorites(product.id);
        } else {
          addToFavorites(product, selectedColor || undefined);
        }
      },
      [isFav, removeFromFavorites, addToFavorites, product, selectedColor]
    );

    const addToCart = React.useCallback(() => {
      if (!isDisabled) {
        onAdd?.(product, {
          color: selectedColor || undefined,
          stampOption: selectedStampOption || undefined,
        });
      }
    }, [isDisabled, onAdd, product, selectedColor, selectedStampOption]);

    // Obtener el color de fondo del producto para determinar el color del texto del botón
    const getButtonTextColor = React.useCallback((): string => {
      if (isDisabled) {
        return "text-neutral-500";
      }

      // Always use white text for the fixed pink button
      return "text-white";
    }, [isDisabled]);

    // Obtener el color de fondo del botón basado en el color seleccionado
    const getButtonStyle = React.useCallback((): React.CSSProperties => {
      if (isDisabled) {
        return {};
      }

      // Always use the fixed pink color
      return {
        backgroundColor: "#e12afb",
      };
    }, [isDisabled]);

    const handleColorChange = React.useCallback((color: ColorOption) => {
      setSelectedColor(color);
    }, []);

    const renderColorBadge = React.useCallback(
      (color: ColorOption, selected: boolean, index: number) => {
        const isCompound = isCompoundColor(product, color.name);

        return (
          <label
            key={`${product.id}-color-${index}-${color.name}`}
            className="inline-flex cursor-pointer"
          >
            <input
              type="radio"
              name={`color-${product.id}`}
              className="peer sr-only"
              checked={selected}
              onChange={() => handleColorChange(color)}
              aria-label={`Color ${color.name}`}
            />
            {isCompound ? (
              <CompoundColorBadge colorName={color.name} selected={selected} />
            ) : (
              <span
                className={clsx(
                  "h-5 w-5 rounded-full border transition",
                  selected
                    ? "border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/20"
                    : "border-neutral-700 hover:border-neutral-600"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            )}
          </label>
        );
      },
      [product, handleColorChange]
    );

    const renderImage = React.useCallback(() => {
      if (!imageUrl || imageError) {
        return <ProductPlaceholderSvg product={product} />;
      }

      const imageProps = {
        src: imageUrl,
        alt: product.name,
        onError: () => setImageError(true),
        priority: false,
      };

      return imageUrl.toLowerCase().endsWith(".svg") ? (
        <Image
          {...imageProps}
          width={800}
          height={1000}
          className="h-full w-full object-contain"
          alt={product.name}
        />
      ) : (
        <Image
          {...imageProps}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain"
          alt={product.name}
        />
      );
    }, [imageUrl, imageError, product]);

    return (
      <div
        className={clsx(
          "group relative flex flex-col rounded-xl border-2 bg-neutral-950 overflow-hidden",
          "transition-colors border-neutral-800",
          highlight && "hover:border-neutral-700",
          isDisabled && "opacity-75",
          className
        )}
        style={
          {
            "--accent": accentHex,
          } as React.CSSProperties
        }
        data-disabled={isDisabled || undefined}
      >
        <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-t-xl bg-neutral-900">
          <Link
            href={`/products/${product.id}`}
            aria-label={`Ver ${product.name}`}
            className="relative block h-full w-full"
          >
            {renderImage()}
          </Link>

          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
            aria-pressed={isFav}
            className={clsx(
              "absolute right-2 top-0 z-30 grid h-9 w-9 place-items-center rounded-full",
              "backdrop-blur-sm shadow-lg cursor-pointer",
              "transition-all duration-300 ease-in-out",
              "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              "bg-black/80 hover:bg-black/90 hover:scale-105"
            )}
            style={{
              top: "5px",
              outline: "1px solid rgba(255, 255, 255, 0.4)",
              outlineOffset: "-1px",
            }}
          >
            <HeartIcon
              className={clsx(
                "h-4 w-4 transition-all duration-300 ease-in-out",
                isFav
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-white hover:text-red-300"
              )}
            />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-black/70">
              <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-200">
                Agotado
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
          {validColors.length > 0 ? (
            <fieldset
              className="flex items-center gap-2"
              aria-label="Colores disponibles"
            >
              <legend className="sr-only">Elegir color</legend>
              {validColors.slice(0, 6).map((color, idx) => {
                const selected = selectedColor?.name === color.name;
                return renderColorBadge(color, selected, idx);
              })}
            </fieldset>
          ) : (
            <div className="h-5" aria-hidden="true" />
          )}

          {/* Stamp Options - Solo mostrar si hay opciones disponibles */}
          {product.stampOptions && product.stampOptions.length > 0 && (
            <div className="mt-3">
              <StampSelector
                selectedOption={selectedStampOption || undefined}
                onOptionChange={setSelectedStampOption}
                productId={product.id}
                stampOptions={product.stampOptions}
                compact={true}
                className="w-full"
              />
            </div>
          )}

          <div className="flex-1">
            <Link
              href={`/products/${product.id}`}
              className="block"
              title={product.name}
            >
              <h3 className="mb-1 line-clamp-2 text-sm font-medium text-neutral-100">
                {product.name}
              </h3>
            </Link>
            <p className="text-lg font-semibold text-white">
              {formatCurrency(totalPrice, product.currency || "ARS")}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              {formatCurrency(discounted, product.currency || "ARS")} con
              transferencia
            </p>
          </div>

          <Button
            onClick={addToCart}
            disabled={isDisabled}
            aria-label={isDisabled ? "Producto agotado" : "Agregar al carrito"}
            style={getButtonStyle()}
            className={clsx(
              "h-10 w-full rounded-lg hover:opacity-95 cursor-pointer",
              isDisabled
                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                : clsx("bg-[var(--color-pink-500)]", getButtonTextColor())
            )}
          >
            {isDisabled ? "Agotado" : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    );
  }
);

export default ProductCard;
