"use client";

import { Suspense, lazy, ComponentType } from "react";
import { Skeleton } from "@/components/molecules/skeleton-loading";

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
      <Suspense fallback={fallback || <Skeleton className="h-96 w-full" />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

export const createLazyComponentFromNamed = <P extends object>(
  importFunc: () => Promise<{ [key: string]: ComponentType<P> }>,
  componentName: string,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(() =>
    importFunc().then((module) => ({ default: module[componentName] }))
  );

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <Skeleton className="h-96 w-full" />}>
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

export const LazyProductGrid = createLazyComponentFromNamed(
  () => import("@/components/organisms/product-grid"),
  "ProductGrid",
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
