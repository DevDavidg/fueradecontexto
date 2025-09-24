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
        "group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900 to-neutral-950",
        "transition-all duration-300 ease-out",
        className
      )}
      aria-hidden
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-neutral-800 to-neutral-900">
        {/* Favorites Button Skeleton */}
        <div className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 backdrop-blur-md shadow-xl animate-pulse">
          <div className="h-4 w-4 bg-white/80 rounded-sm" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800 animate-pulse" />

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-6 w-6 rounded-full border-2 border-neutral-600 bg-neutral-800 animate-pulse"
            />
          ))}
        </div>

        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-neutral-800 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-neutral-800 rounded animate-pulse" />
        </div>

        <div className="h-12 w-full rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-700 animate-pulse" />
      </div>
    </div>
  );
};
