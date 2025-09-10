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
        "group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950",
        "transition-colors",
        className
      )}
      aria-hidden
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-xl bg-neutral-900">
        {/* Favorites Button Skeleton */}
        <div className="absolute right-2 top-2 z-50 grid h-8 w-8 place-items-center rounded-full border-2 border-white/50 bg-black/90 backdrop-blur-sm shadow-xl animate-pulse">
          <div className="h-4 w-4 bg-white rounded-sm drop-shadow-sm" />
        </div>

        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-5 w-5 rounded-full border border-neutral-600 bg-neutral-800 animate-pulse"
            />
          ))}
        </div>

        <div className="flex-1">
          <div className="mb-1 h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-neutral-800 rounded animate-pulse" />
          <div className="mt-1 h-3 w-2/3 bg-neutral-800 rounded animate-pulse" />
        </div>

        <div className="h-10 w-full rounded-lg bg-neutral-800 animate-pulse" />
      </div>
    </div>
  );
};
