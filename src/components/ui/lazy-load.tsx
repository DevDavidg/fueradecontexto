"use client";

import { Suspense, lazy, ComponentType } from "react";
import { SkeletonLoading } from "@/components/molecules/skeleton-loading";

// interface LazyLoadProps {
//   fallback?: React.ReactNode;
// }

export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <SkeletonLoading />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// Pre-configured lazy components for common use cases
export const LazyProductCard = createLazyComponent(
  () => import("@/components/molecules/product-card"),
  <div className="animate-pulse bg-neutral-800 rounded-2xl h-96" />
);

export const LazyProductGrid = createLazyComponent(
  () => import("@/components/organisms/product-grid"),
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="animate-pulse bg-neutral-800 rounded-2xl h-96" />
    ))}
  </div>
);

export const LazyStampSelector = createLazyComponent(
  () => import("@/components/molecules/stamp-selector"),
  <div className="animate-pulse bg-neutral-800 rounded-lg h-20" />
);
