"use client";

import { clsx } from "clsx";

type ProductsPageSkeletonProps = {
  className?: string;
};

export const ProductsPageSkeleton = ({
  className,
}: ProductsPageSkeletonProps) => {
  return (
    <div className={clsx("min-h-screen bg-black text-[#ededed]", className)}>
      {/* Navbar skeleton */}
      <div className="border-b border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-neutral-800 rounded animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
              <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-neutral-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-neutral-800 rounded animate-pulse" />
        </div>

        {/* Categories skeleton */}
        {[1, 2, 3, 4].map((categoryIndex) => (
          <section key={categoryIndex} className="mb-12">
            {/* Category header */}
            <div className="mb-6">
              <div className="h-6 w-32 bg-neutral-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-80 bg-neutral-800 rounded animate-pulse" />
            </div>

            {/* Products grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
              {Array.from({ length: 4 }).map((_, productIndex) => (
                <div
                  key={productIndex}
                  className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 overflow-hidden border border-neutral-800/50 shadow-lg transition-all duration-300 ease-out"
                >
                  {/* Image skeleton */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800 animate-pulse" />

                    {/* Favorites button skeleton */}
                    <div className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 backdrop-blur-md shadow-xl animate-pulse">
                      <div className="h-4 w-4 bg-white/80 rounded-sm" />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Content skeleton */}
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    {/* Color badges skeleton */}
                    <div className="flex items-center gap-3">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-6 w-6 rounded-full border-2 border-neutral-600 bg-neutral-800 animate-pulse"
                        />
                      ))}
                    </div>

                    {/* Text content skeleton */}
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-neutral-800 rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-neutral-800 rounded animate-pulse" />
                    </div>

                    {/* Button skeleton */}
                    <div className="h-12 w-full rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-700 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Table skeleton */}
        <section className="mt-12">
          <div className="h-6 w-40 bg-neutral-800 rounded animate-pulse mb-4" />
          <div className="overflow-x-auto rounded-lg border border-[#333333]">
            <div className="w-full">
              {/* Table header skeleton */}
              <div className="bg-[#111111] p-3">
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-neutral-700 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-neutral-700 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-neutral-700 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-neutral-700 rounded animate-pulse" />
                </div>
              </div>

              {/* Table rows skeleton */}
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`p-3 ${
                    index % 2 === 0 ? "bg-[#0b0b0b]" : "bg-transparent"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="h-4 w-12 bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-neutral-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
