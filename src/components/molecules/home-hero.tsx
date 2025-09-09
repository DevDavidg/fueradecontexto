"use client";

type HomeHeroProps = {
  title?: string | null;
  description?: string | null;
  isLoading?: boolean;
};

export const HomeHero = ({ title, description, isLoading }: HomeHeroProps) => {
  const showSkeleton = isLoading || (!title && !description);
  return (
    <section className="py-6">
      <div className="mx-auto max-w-5xl px-0 sm:px-2">
        <div className="relative z-0 w-full aspect-[4/3] sm:aspect-[16/9] rounded-md bg-[#111111] border border-[#333333] grid place-items-center">
          {showSkeleton ? (
            <div className="h-6 w-24 bg-neutral-800 rounded animate-pulse" />
          ) : (
            <span className="text-xs sm:text-sm text-neutral-500 select-none">
              {title ?? "IMG"}
            </span>
          )}
        </div>
        <p className="mt-4 text-center text-base sm:text-lg font-medium tracking-wide text-neutral-200 uppercase">
          {showSkeleton ? (
            <span className="inline-block h-5 w-5/6 bg-neutral-800 rounded animate-pulse" />
          ) : (
            description ??
            "No seguimos tendencias, creamos prendas que cuentan tu historia"
          )}
        </p>
      </div>
      <div className="mt-6 border-t border-[#333333]" />
    </section>
  );
};
