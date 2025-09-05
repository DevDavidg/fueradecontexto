"use client";

import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";

export const LoadMoreCTA = () => {
  const { hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useProducts();

  if (isLoading) {
    return (
      <div
        className="inline-flex h-10 w-36 rounded-md border border-[#333333] bg-[#111111] animate-pulse"
        aria-hidden="true"
      />
    );
  }

  if (!hasNextPage) {
    return null;
  }

  const handleClick = () => {
    if (isFetchingNextPage) return;
    fetchNextPage();
  };

  return (
    <Button
      onClick={handleClick}
      aria-label="Cargar más productos"
      disabled={isFetchingNextPage}
      className="px-6 h-10 rounded-md bg-[#C2187A] hover:bg-pink-700 text-sm"
    >
      {isFetchingNextPage ? "Cargando…" : "Cargar más"}
    </Button>
  );
};
