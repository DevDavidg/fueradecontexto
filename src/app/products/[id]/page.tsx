"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/molecules/navbar";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format-currency";
import { type PrintOption, type Product } from "@/lib/types";

const getProductById = (products: Product[] | undefined, id: string) => {
  if (!products) return undefined;
  return products.find((p) => p.id === id);
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: products } = useProducts();
  const product = useMemo(
    () => getProductById(products, params.id),
    [products, params.id]
  );
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<
    Product["availableSizes"][number] | undefined
  >(product?.availableSizes[0]);
  const [selectedPrint, setSelectedPrint] = useState<PrintOption | undefined>(
    product?.customizable?.printOptions[0]
  );
  const [selectedColor, setSelectedColor] = useState<
    { name: string; hex: string } | undefined
  >(product?.customizable?.colors[0]);

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

  const extra = selectedPrint?.extraCost ?? 0;
  const total = product.price + extra;

  const handleAddToCart = () => {
    addItem(
      product,
      selectedSize,
      1,
      selectedPrint && selectedColor
        ? {
            printSizeId: selectedPrint.id,
            colorName: selectedColor.name,
            colorHex: selectedColor.hex,
            extraCost: selectedPrint.extraCost,
          }
        : undefined
    );
    router.push("/checkout");
  };

  const isCustomizable = Boolean(product.customizable);

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square overflow-hidden rounded-md bg-[#111111]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">{product.description}</p>
          <p className="text-xl font-semibold mt-3">
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
                        ? "border-[#C2187A]"
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
                <div>
                  <p className="text-sm font-medium mb-2">Tamaño de estampa</p>
                  <div className="flex flex-wrap gap-2">
                    {product.customizable!.printOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedPrint(option)}
                        aria-label={`Seleccionar estampa ${option.label}`}
                        className={
                          "px-3 py-2 rounded-md text-sm border text-[#ededed] " +
                          (selectedPrint?.id === option.id
                            ? "border-[#C2187A]"
                            : "border-[#333333]")
                        }
                      >
                        {option.label} (+
                        {formatCurrency(option.extraCost, product.currency)})
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.customizable!.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Seleccionar color ${color.name}`}
                        className={
                          "px-3 py-2 rounded-md text-sm border flex items-center gap-2 text-[#ededed] " +
                          (selectedColor?.name === color.name
                            ? "border-[#C2187A]"
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
