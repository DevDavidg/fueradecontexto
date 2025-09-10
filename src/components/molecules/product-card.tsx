"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { ProductPlaceholderSvg } from "@/components/ui/placeholder-svg";
import { HeartIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/format-currency";
import { type Product, type ColorOption } from "@/lib/types";
import { useFavorites } from "@/hooks/use-favorites";

const COMPOUND_COLOR_MAP: Record<string, { color1: string; color2: string }> = {
  "Negro Blanca": { color1: "#000000", color2: "#FFFFFF" },
  "Gris Blanco": { color1: "#808080", color2: "#FFFFFF" },
  "Azul Roja Blanca": { color1: "#2563EB", color2: "#DC2626" },
  "Azul Beige Roja": { color1: "#2563EB", color2: "#F5DEB3" },
  "Verde Militar Blanca": { color1: "#166534", color2: "#FFFFFF" },
  "Violeta Blanca": { color1: "#7C3AED", color2: "#FFFFFF" },
};

const SPECIAL_COLOR_MAPPINGS: Record<string, string> = {
  "Azul Roja Blanca": "azul_roja_blanca",
  "Azul Beige Roja": "azul_beige_roja",
  "Verde Militar Blanca": "verde_militar_blanca",
  "Violeta Blanca": "violeta_blanca",
  "Negro Blanca": "negra_blanca",
  "Gris Blanco": "gris_blanco",
};

const getCompoundColors = (
  colorName: string
): { color1: string; color2: string } => {
  return (
    COMPOUND_COLOR_MAP[colorName] || { color1: "#000000", color2: "#FFFFFF" }
  );
};

// Función para detectar si un color es claro u oscuro
const isLightColor = (hexColor: string): boolean => {
  // Remover el # si está presente
  const hex = hexColor.replace("#", "");

  // Convertir a RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calcular la luminancia usando la fórmula estándar
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Usar un umbral más conservador para mejor contraste
  return luminance > 0.6;
};

// Función para obtener el color de texto apropiado basado en el color de fondo
const getTextColorForBackground = (backgroundColor: string): string => {
  const isLight = isLightColor(backgroundColor);

  if (isLight) {
    // Para fondos claros, usar texto oscuro con sombra para mejor contraste
    return "text-gray-900 font-semibold drop-shadow-sm";
  } else {
    // Para fondos oscuros, usar texto claro con sombra
    return "text-white font-semibold drop-shadow-sm";
  }
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
          ? "border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/30"
          : "border-neutral-600 hover:border-neutral-500"
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
  onAdd?: (product: Product, options?: { color?: ColorOption }) => void;
  className?: string;
  highlight?: boolean;
};

const normalizeColorName = (colorName: string): string => {
  return (
    SPECIAL_COLOR_MAPPINGS[colorName] ||
    colorName
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/á/g, "a")
      .replace(/é/g, "e")
      .replace(/í/g, "i")
      .replace(/ó/g, "o")
      .replace(/ú/g, "u")
      .replace(/ñ/g, "n")
  );
};

const fixGenderSpecificNaming = (
  normalizedColor: string,
  categoria: string
): string => {
  if (categoria === "gorras") {
    return normalizedColor.replace(/negro$/, "negra").replace(/rojo$/, "roja");
  }
  return normalizedColor;
};

const getImagePathForProduct = (
  product: Product,
  colorName: string
): string => {
  const categoria = product.categoria?.toLowerCase();
  const productType = product.name.toLowerCase();

  const normalizedColor = normalizeColorName(colorName);
  const genderFixedColor = fixGenderSpecificNaming(
    normalizedColor,
    categoria || ""
  );

  if (categoria === "buzos") {
    if (productType.includes("cuello redondo")) {
      return `/img/buzo_cuello_redondo_${genderFixedColor}.png`;
    }
    if (productType.includes("canguro")) {
      return `/img/buzo_canguro_${genderFixedColor}.png`;
    }
  } else if (categoria === "camperas") {
    if (colorName.toLowerCase() === "gris") {
      return "/img/campera_gris.png";
    }
    return "/img/campera_negra_global.png";
  } else if (categoria === "totebags") {
    return "/img/tote_bag_global.png";
  } else if (categoria === "gorras") {
    if (productType.includes("gabardina")) {
      return `/img/gorra_gabardina_${genderFixedColor}.png`;
    }
    if (productType.includes("trucker")) {
      return `/img/gorra_trucker_${genderFixedColor}.png`;
    }
  }
  return "";
};

const validateImageExists = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(imagePath, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
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

    React.useEffect(() => {
      const validateColors = async () => {
        if (!product.customizable?.colors) return;

        const validColorPromises = product.customizable.colors.map(
          async (color) => {
            const imagePath = getImagePathForProduct(product, color.name);
            if (!imagePath) return null;

            const exists = await validateImageExists(imagePath);
            return exists ? color : null;
          }
        );

        const validColorsResult = (
          await Promise.all(validColorPromises)
        ).filter((color): color is ColorOption => color !== null);

        setValidColors(validColorsResult);

        if (
          selectedColor &&
          !validColorsResult.find((c) => c.name === selectedColor.name)
        ) {
          setSelectedColor(validColorsResult[0] || null);
        }
      };

      validateColors();
    }, [product, selectedColor]);

    React.useEffect(() => setImageError(false), [selectedColor]);

    const isDisabled = !product.inStock;
    const isFav = isFavorite(product.id);
    const accentHex = selectedColor?.hex || "#C2187A";
    const discounted = Math.round(product.price * 0.9);

    const imageUrl = React.useMemo(() => {
      if (!selectedColor?.name) return product.imageUrl;

      const colorImagePath = getImagePathForProduct(
        product,
        selectedColor.name
      );
      if (validColors.find((c) => c.name === selectedColor.name)) {
        return colorImagePath || product.imageUrl;
      }

      return product.imageUrl;
    }, [product, selectedColor, validColors]);

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
        onAdd?.(product, { color: selectedColor || undefined });
      }
    }, [isDisabled, onAdd, product, selectedColor]);

    // Obtener el color de fondo del producto para determinar el color del texto del botón
    const getButtonTextColor = React.useCallback((): string => {
      if (isDisabled) {
        return "text-neutral-500";
      }

      // Si hay un color seleccionado, usar su hex
      if (selectedColor?.hex) {
        return getTextColorForBackground(selectedColor.hex);
      }

      // Si no hay color seleccionado, usar el color por defecto
      return "text-white";
    }, [isDisabled, selectedColor]);

    // Obtener el color de fondo del botón basado en el color seleccionado
    const getButtonStyle = React.useCallback((): React.CSSProperties => {
      if (isDisabled) {
        return {};
      }

      // Si hay un color seleccionado, usar su hex como fondo
      if (selectedColor?.hex) {
        console.log(
          "Botón con color:",
          selectedColor.hex,
          "Texto:",
          getTextColorForBackground(selectedColor.hex)
        );
        return {
          backgroundColor: selectedColor.hex,
        };
      }

      // Si no hay color seleccionado, usar el color por defecto
      return {};
    }, [isDisabled, selectedColor]);

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
                    ? "border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/30"
                    : "border-neutral-600 hover:border-neutral-500"
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
          "group relative flex flex-col rounded-xl border bg-neutral-950 overflow-hidden",
          "transition-colors",
          highlight && "hover:border-neutral-700",
          isDisabled && "opacity-75",
          className
        )}
        style={
          {
            "--accent": accentHex,
            borderColor: selectedColor ? accentHex : "#262626",
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
              isFav
                ? "bg-red-500/90 hover:bg-red-500 hover:scale-110"
                : "bg-black/80 hover:bg-black/90 hover:scale-105"
            )}
            style={{
              top: "5px",
              outline: isFav
                ? "2px solid var(--accent)"
                : "1px solid rgba(255, 255, 255, 0.4)",
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
              {formatCurrency(product.price, product.currency || "ARS")}
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
                : clsx(
                    selectedColor?.hex ? "" : "bg-[color:var(--accent)]",
                    getButtonTextColor()
                  )
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
