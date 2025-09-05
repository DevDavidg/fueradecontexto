"use client";

import { clsx } from "clsx";

type ProductCardSkeletonProps = {
  className?: string;
};

export const ProductCardSkeleton = ({
  className,
}: ProductCardSkeletonProps) => {
  return (
    <div
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-[#333333]/60 bg-gradient-to-b from-[#0f0f0f] to-[#0b0b0b] backdrop-blur-sm",
        "transition-all duration-300 ease-out opacity-100",
        className
      )}
      aria-hidden
    >
      <div className="relative w-full overflow-hidden rounded-t-2xl bg-gradient-to-b from-[#1a1a1a] to-[#111111] p-4">
        <div className="aspect-[4/5] relative">
          <div className="absolute inset-0 rounded-xl bg-[#151515] animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-4">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-5 w-5 rounded-full border-2 border-[#333333] bg-[#1a1a1a] animate-pulse"
            />
          ))}
        </div>

        <div className="flex-1 min-h-0">
          <div className="h-4 w-3/4 bg-[#1a1a1a] rounded mb-2 animate-pulse" />
          <div className="h-4 w-1/2 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="mt-3 h-10 w-2/3 bg-[#1a1a1a] rounded animate-pulse" />
        </div>

        <div className="h-12 w-full rounded-xl bg-[#1a1a1a] animate-pulse" />
      </div>
    </div>
  );
};
