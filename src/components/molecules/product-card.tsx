"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { ProductPlaceholderSvg } from "@/components/ui/placeholder-svg";
import { HeartIcon, CartIcon } from "@/components/ui/icons";
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
        "h-6 w-6 rounded-full border-2 transition-all duration-200 relative overflow-hidden shadow-sm",
        selected
          ? "border-pink-500 ring-2 ring-pink-500/30 scale-110"
          : "border-neutral-600 hover:border-neutral-500 hover:scale-105"
      )}
      title={colorName}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${color1} 0%, ${color1} 50%, ${color2} 50%, ${color2} 100%)`,
        }}
      />
      {selected && (
        <div className="absolute inset-0 bg-white/20 rounded-full" />
      )}
    </div>
  );
};

export type ProductCardProps = {
  product: Product;
  onAdd?: (
    product: Product,
    options?: { color?: ColorOption; stampOptions?: StampOption[] }
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
    const [imageLoading, setImageLoading] = React.useState(true);
    const [validColors, setValidColors] = React.useState<ColorOption[]>(
      product.customizable?.colors || []
    );
    const [selectedColor, setSelectedColor] =
      React.useState<ColorOption | null>(
        product.customizable?.colors?.[0] || null
      );
    const [selectedStampOptions, setSelectedStampOptions] = React.useState<
      StampOption[]
    >([]);

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

    React.useEffect(() => {
      setImageError(false);
      setImageLoading(true);
    }, [selectedColor]);

    const isDisabled = !product.inStock;
    const isFav = isFavorite(product.id);
    const accentHex = "#e12afb"; // Always use fixed pink color
    const stampExtraCost = selectedStampOptions.reduce(
      (total, option) => total + option.extraCost,
      0
    );
    const totalPrice = product.price + stampExtraCost;
    const discounted = Math.round(totalPrice * 0.9);

    const imageUrl = React.useMemo(() => {
      return getImageForColor(product, selectedColor?.name);
    }, [product, selectedColor]);

    // Pre-load image in background
    React.useEffect(() => {
      if (imageUrl && !imageUrl.includes("placeholder")) {
        const img = new window.Image();
        img.src = imageUrl;
        img.onload = () => {
          // Image is pre-loaded, but we still wait for the actual Image component to load
        };
      }
    }, [imageUrl]);

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
          stampOptions: selectedStampOptions,
        });
      }
    }, [isDisabled, onAdd, product, selectedColor, selectedStampOptions]);

    const handleColorChange = React.useCallback((color: ColorOption) => {
      setSelectedColor(color);
    }, []);

    const renderColorBadge = React.useCallback(
      (color: ColorOption, selected: boolean, index: number) => {
        const isCompound = isCompoundColor(product, color.name);

        return (
          <label
            key={`${product.id}-color-${index}-${color.name}`}
            className="inline-flex cursor-pointer group"
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
                  "h-6 w-6 rounded-full border-2 transition-all duration-200 shadow-sm",
                  selected
                    ? "border-pink-500 ring-2 ring-pink-500/30 scale-110"
                    : "border-neutral-600 hover:border-neutral-500 hover:scale-105"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {selected && (
                  <div className="absolute inset-0 bg-white/20 rounded-full" />
                )}
              </span>
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
        onLoad: () => setImageLoading(false),
        priority: false,
      };

      return (
        <div className="relative h-full w-full">
          {/* Skeleton overlay while loading */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800 animate-pulse z-10" />
          )}

          {imageUrl.toLowerCase().endsWith(".svg") ? (
            <Image
              {...imageProps}
              width={800}
              height={1000}
              className={clsx(
                "h-full w-full object-contain transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              alt={product.name}
            />
          ) : (
            <Image
              {...imageProps}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={clsx(
                "object-contain transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              alt={product.name}
            />
          )}
        </div>
      );
    }, [imageUrl, imageError, imageLoading, product]);

    return (
      <div
        className={clsx(
          "group relative flex flex-col rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 overflow-hidden",
          "border border-neutral-800/50 shadow-lg hover:shadow-2xl",
          "transition-all duration-300 ease-out",
          highlight && "hover:border-neutral-700/70 hover:-translate-y-1",
          isDisabled && "opacity-60 grayscale",
          className
        )}
        style={
          {
            "--accent": accentHex,
          } as React.CSSProperties
        }
        data-disabled={isDisabled || undefined}
      >
        <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-neutral-800 to-neutral-900">
          <Link
            href={`/products/${product.id}`}
            aria-label={`Ver ${product.name}`}
            className="relative block h-full w-full group/image"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-10" />
            {renderImage()}
          </Link>

          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
            aria-pressed={isFav}
            className={clsx(
              "absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full",
              "backdrop-blur-md shadow-xl cursor-pointer",
              "transition-all duration-300 ease-out",
              "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50",
              "bg-black/60 hover:bg-black/80 border border-white/20"
            )}
          >
            <HeartIcon
              className={clsx(
                "h-4 w-4 transition-all duration-300 ease-out",
                isFav
                  ? "fill-red-500 text-red-500 scale-110 drop-shadow-lg"
                  : "text-white hover:text-red-400 hover:scale-110"
              )}
            />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/80 backdrop-blur-sm">
              <div className="bg-red-600/90 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/50">
                <span className="text-sm font-medium text-white">Agotado</span>
              </div>
            </div>
          )}

          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          {validColors.length > 0 && (
            <fieldset
              className="flex items-center gap-3"
              aria-label="Colores disponibles"
            >
              <legend className="sr-only">Elegir color</legend>
              {validColors.slice(0, 6).map((color, idx) => {
                const selected = selectedColor?.name === color.name;
                return renderColorBadge(color, selected, idx);
              })}
            </fieldset>
          )}

          {/* Stamp Options - Solo mostrar si hay opciones disponibles */}
          {product.stampOptions && product.stampOptions.length > 0 && (
            <div className="mt-2">
              <StampSelector
                selectedOptions={selectedStampOptions}
                onOptionsChange={setSelectedStampOptions}
                productId={product.id}
                stampOptions={product.stampOptions}
                compact={true}
                className="w-full"
              />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <Link
              href={`/products/${product.id}`}
              className="block group/title"
              title={product.name}
            >
              <h3 className="line-clamp-2 text-base font-semibold text-white group-hover/title:text-pink-400 transition-colors duration-200">
                {product.name}
              </h3>
            </Link>

            <div className="space-y-1">
              <p className="text-xl font-bold text-white">
                {formatCurrency(totalPrice, product.currency || "ARS")}
              </p>
              <p className="text-sm text-neutral-400">
                {formatCurrency(discounted, product.currency || "ARS")} con
                transferencia
              </p>
            </div>
          </div>

          <Button
            onClick={addToCart}
            disabled={isDisabled}
            aria-label={isDisabled ? "Producto agotado" : "Agregar al carrito"}
            className={clsx(
              "h-12 w-full rounded-xl font-semibold text-base transition-all duration-200",
              "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
              isDisabled
                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0 hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isDisabled ? (
              <span className="flex items-center justify-center gap-2">
                <span>Agotado</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Agregar al carrito</span>
                <CartIcon className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    );
  }
);

export default ProductCard;
