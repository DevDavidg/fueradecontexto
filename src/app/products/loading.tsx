import { ProductCardSkeleton } from "@/components/molecules/product-card-skeleton";
import { GRID_SKELETON_COUNT } from "@/lib/constants";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <div className="mb-4">
          <div className="h-7 w-40 bg-neutral-800 rounded animate-pulse" />
          <div className="mt-2 h-4 w-56 bg-neutral-900 rounded animate-pulse" />
        </div>

        <section>
          <div className="h-6 w-28 bg-neutral-800 rounded animate-pulse" />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: GRID_SKELETON_COUNT }).map((_, i) => (
              <ProductCardSkeleton key={`sk-${i}`} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
