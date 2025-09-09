"use client";

import { Button } from "@/components/ui/button";

type LoadMoreCTAProps = {
  hasNextPage?: boolean;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  onClick: () => void;
};

export const LoadMoreCTA = ({
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  onClick,
}: LoadMoreCTAProps) => {
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
    onClick();
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
