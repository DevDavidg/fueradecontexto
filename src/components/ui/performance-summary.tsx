"use client";

import { useEffect, useState } from "react";

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const PerformanceSummary = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return;

    // Simple performance capture without complex state management
    const captureMetrics = () => {
      if (typeof window !== "undefined" && "performance" in window) {
        const newMetrics: PerformanceMetrics = {};

        // Get LCP
        try {
          const lcpEntries = performance.getEntriesByType(
            "largest-contentful-paint"
          );
          if (lcpEntries.length > 0) {
            const lcp = lcpEntries[lcpEntries.length - 1] as PerformanceEntry;
            newMetrics.lcp = lcp.startTime;
          }
        } catch {
          // Ignore errors
        }

        // Get FCP
        try {
          const fcpEntries = performance.getEntriesByName(
            "first-contentful-paint"
          );
          if (fcpEntries.length > 0) {
            const fcp = fcpEntries[0] as PerformanceEntry;
            newMetrics.fcp = fcp.startTime;
          }
        } catch {
          // Ignore errors
        }

        // Get TTFB
        try {
          const navEntries = performance.getEntriesByType("navigation");
          if (navEntries.length > 0) {
            const nav = navEntries[0] as PerformanceNavigationTiming;
            newMetrics.ttfb = nav.responseStart - nav.requestStart;
          }
        } catch {
          // Ignore errors
        }

        if (Object.keys(newMetrics).length > 0) {
          setMetrics(newMetrics);
        }
      }
    };

    // Show summary after 3 seconds
    const timer = setTimeout(() => {
      captureMetrics();
      setIsVisible(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (
    !isVisible ||
    process.env.NODE_ENV !== "development" ||
    Object.keys(metrics).length === 0
  ) {
    return null;
  }

  const getScoreColor = (metric: string, value: number) => {
    switch (metric) {
      case "lcp":
        return value <= 2500
          ? "text-green-500"
          : value <= 4000
          ? "text-yellow-500"
          : "text-red-500";
      case "fid":
        return value <= 100
          ? "text-green-500"
          : value <= 300
          ? "text-yellow-500"
          : "text-red-500";
      case "cls":
        return value <= 0.1
          ? "text-green-500"
          : value <= 0.25
          ? "text-yellow-500"
          : "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getScoreLabel = (metric: string, value: number) => {
    switch (metric) {
      case "lcp":
        return value <= 2500
          ? "Good"
          : value <= 4000
          ? "Needs Improvement"
          : "Poor";
      case "fid":
        return value <= 100
          ? "Good"
          : value <= 300
          ? "Needs Improvement"
          : "Poor";
      case "cls":
        return value <= 0.1
          ? "Good"
          : value <= 0.25
          ? "Needs Improvement"
          : "Poor";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm border border-neutral-700 rounded-lg p-4 text-xs text-white z-50 max-w-xs">
      <h3 className="font-semibold mb-2 text-sm">Core Web Vitals</h3>
      <div className="space-y-1">
        {Object.entries(metrics).map(([metric, value]) => (
          <div key={metric} className="flex justify-between items-center">
            <span className="uppercase font-mono">{metric}:</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono ${getScoreColor(metric, value)}`}>
                {value.toFixed(2)}ms
              </span>
              <span
                className={`text-xs px-1 py-0.5 rounded ${getScoreColor(
                  metric,
                  value
                )} bg-current/10`}
              >
                {getScoreLabel(metric, value)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-neutral-700 text-xs text-neutral-400">
        Development metrics only
      </div>
    </div>
  );
};
