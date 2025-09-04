"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { type Product } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const isDisabled = !product.inStock;

  const handleAddToCart = () => {
    if (isDisabled) return;
    addItem(product, 1);
  };

  return (
    <div className="group rounded-lg border border-neutral-200 p-3 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md bg-neutral-100">
        <Link
          href={`/products/${product.id}`}
          aria-label={`Ver ${product.name}`}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 grid place-items-center text-xs font-medium">
            Agotado
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-medium truncate hover:underline"
            title={product.name}
          >
            {product.name}
          </Link>
          <p className="text-sm text-neutral-500">
            ${product.price} {product.currency}
          </p>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={isDisabled}
          aria-label="Agregar al carrito"
        >
          {isDisabled ? "Agotado" : "Agregar"}
        </Button>
      </div>
    </div>
  );
};
