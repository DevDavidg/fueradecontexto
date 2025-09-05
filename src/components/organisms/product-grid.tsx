"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/molecules/product-card";
import { useCart } from "@/hooks/use-cart";
import { ProductCardSkeleton } from "@/components/molecules/product-card-skeleton";

export const ProductGrid = () => {
  const { data, isLoading, isFetchingNextPage } = useProducts();
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {["a", "b", "c", "d", "e", "f", "g", "h"].map((key) => (
          <ProductCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-neutral-400">
        No hay productos por el momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={() => addItem(product)}
        />
      ))}
      {isFetchingNextPage &&
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
    </div>
  );
};
