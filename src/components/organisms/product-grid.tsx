"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/molecules/product-card";
import { useCart } from "@/hooks/use-cart";
import { ProductCardSkeleton } from "@/components/molecules/product-card-skeleton";
import { GRID_SKELETON_COUNT } from "@/lib/constants";
import { LoadMoreCTA } from "@/components/molecules/load-more-cta";
import type { Product, ColorOption, StampOption } from "@/lib/types";

export const ProductGrid = ({ categoria }: { categoria?: string }) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useProducts(categoria);
  const { addItem } = useCart();

  const handleAddToCart = (
    product: Product,
    options?: { color?: ColorOption; stamp?: StampOption }
  ) => {
    const hasCustomization = options?.stamp !== undefined;

    const customization =
      hasCustomization && options?.stamp
        ? {
            printSizeId: options.stamp.size,
            printPlacement: options.stamp.placement,
            colorName: options.color?.name || "Estándar",
            colorHex: options.color?.hex || "#000000",
            extraCost: options.stamp.extraCost,
          }
        : undefined;

    addItem(
      product,
      product.availableSizes?.[0], // Default to first size
      1,
      customization
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
        {Array.from({ length: GRID_SKELETON_COUNT }).map((_, i) => (
          <ProductCardSkeleton
            key={`sk-${i}`}
            className="animate-in fade-in-0 duration-300"
          />
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
        {items.map((product, index) => (
          <div
            key={product.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} onAdd={handleAddToCart} />
          </div>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: GRID_SKELETON_COUNT }).map((_, i) => (
            <ProductCardSkeleton
              key={`skeleton-${i}`}
              className="animate-in fade-in-0 duration-300"
            />
          ))}
      </div>
      <div className="mt-8 flex items-center justify-center">
        <LoadMoreCTA
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        />
      </div>
    </>
  );
};
