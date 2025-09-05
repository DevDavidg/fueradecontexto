"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/molecules/product-card";

export const ProductGrid = () => {
  const { data, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {["a", "b", "c", "d", "e", "f", "g", "h"].map((key) => (
          <div
            key={key}
            className="rounded-lg border border-[#333333] p-3 h-[320px] animate-pulse bg-[#111111]"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-neutral-400">
        No hay productos por el momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
