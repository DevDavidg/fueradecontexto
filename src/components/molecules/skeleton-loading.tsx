"use client";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => {
  return (
    <div className={`animate-pulse bg-neutral-800 rounded ${className}`} />
  );
};

export const SkeletonText = ({ lines = 1 }: SkeletonProps) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <SkeletonText lines={3} />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonFormSection = () => {
  return (
    <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SkeletonStampOption = () => {
  return (
    <div className="flex items-center space-x-3 p-4 border border-[#333333] rounded-lg">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
};

export const SkeletonImageGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="relative">
          <Skeleton className="w-full h-32 rounded-md" />
          <Skeleton className="absolute top-2 right-2 h-6 w-6 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonColorItem = () => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md">
      <Skeleton className="w-12 h-12 rounded" />
      <Skeleton className="flex-1 h-10" />
      <Skeleton className="h-5 w-5" />
    </div>
  );
};

export const SkeletonSizeItem = () => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md">
      <Skeleton className="flex-1 h-10" />
      <Skeleton className="h-5 w-5" />
    </div>
  );
};

export const SkeletonPrintSizeItem = () => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md">
      <Skeleton className="flex-1 h-10" />
      <Skeleton className="w-32 h-10" />
      <Skeleton className="h-5 w-5" />
    </div>
  );
};
