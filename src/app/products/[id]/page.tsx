"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/organisms/navbar";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format-currency";
import { type PrintOption, type Product, type StampOption } from "@/lib/types";
import { StampSelector } from "@/components/molecules/stamp-selector";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product } = useProduct(params.id);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<
    Product["availableSizes"][number] | undefined
  >(product?.availableSizes[0]);
  const [selectedPrint, setSelectedPrint] = useState<PrintOption | undefined>(
    product?.customizable?.printOptions[0]
  );
  const [selectedStampOption, setSelectedStampOption] = useState<StampOption | undefined>();
  const [selectedColor, setSelectedColor] = useState<
    { name: string; hex: string } | undefined
  >(product?.customizable?.colors[0]);
  const [imageError, setImageError] = useState(false);

  // Reset image error when color changes
  useEffect(() => {
    setImageError(false);
  }, [selectedColor]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-[#ededed]">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
          <p className="text-sm text-neutral-400">Cargando producto...</p>
        </main>
      </div>
    );
  }

  const extra = selectedPrint?.extraCost ?? selectedStampOption?.extraCost ?? 0;
  const total = product.price + extra;

  const handleAddToCart = () => {
    addItem(
      product,
      selectedSize,
      1,
      (selectedPrint || selectedStampOption) && selectedColor
        ? {
            printSizeId: selectedPrint?.id || selectedStampOption?.size || "hasta_15cm",
            printPlacement: selectedStampOption?.placement,
            colorName: selectedColor.name,
            colorHex: selectedColor.hex,
            extraCost: selectedPrint?.extraCost || selectedStampOption?.extraCost || 0,
          }
        : undefined
    );
    router.push("/checkout");
  };

  const isCustomizable = Boolean(product.customizable);

  const getImageUrlForColor = (colorName: string) => {
    if (!colorName) {
      return product.imageUrl;
    }

    // Find the image URL for the selected color from the product's images array
    if (product.product_images && product.product_images.length > 0) {
      const colorImage = product.product_images.find(
        (img) => img.color.toLowerCase() === colorName.toLowerCase()
      );

      if (colorImage) {
        return colorImage.url;
      }

      // If no specific color image found, return the first available image
      return product.product_images[0]?.url || product.imageUrl;
    }

    return product.imageUrl;
  };

  const getCurrentImageUrl = () => {
    return selectedColor?.name
      ? getImageUrlForColor(selectedColor.name)
      : product.imageUrl;
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="relative w-full aspect-square overflow-hidden rounded-md bg-[#111111] grid place-items-center">
          {!imageError && getCurrentImageUrl() ? (
            <Image
              src={getCurrentImageUrl()}
              alt={product.name}
              fill
              className="object-contain md:object-cover transition-all duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-neutral-500 text-sm">Imagen no disponible</div>
          )}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="text-sm md:text-base text-neutral-400 mt-1">
            {product.description}
          </p>
          <p className="text-xl md:text-2xl font-semibold mt-3">
            {formatCurrency(total, product.currency)}
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Talle</p>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Seleccionar talle ${size}`}
                    className={
                      "px-3 py-2 rounded-md text-sm border text-[#ededed] " +
                      (selectedSize === size
                        ? "border-[var(--accent)]"
                        : "border-[#333333]")
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {isCustomizable && (
              <div className="space-y-4">
                <StampSelector
                  selectedOption={selectedStampOption}
                  onOptionChange={setSelectedStampOption}
                  productId={product.id}
                  compact={false}
                />

                <div>
                  <p className="text-sm font-medium mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.customizable!.colors.map((color, index) => (
                      <button
                        key={`${product.id}-detail-color-${index}-${color.name}`}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Seleccionar color ${color.name}`}
                        className={
                          "px-3 py-2 rounded-md text-sm border flex items-center gap-2 text-[#ededed] " +
                          (selectedColor?.name === color.name
                            ? "border-[var(--accent)]"
                            : "border-[#333333]")
                        }
                      >
                        <span
                          aria-hidden
                          className="inline-block w-4 h-4 rounded-sm border border-[#333333]"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button
              className="w-full mt-4"
              onClick={handleAddToCart}
              aria-label="Agregar y continuar al checkout"
            >
              Agregar al carrito y pagar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
