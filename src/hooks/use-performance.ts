"use client";

import { useEffect, useCallback } from "react";

// Performance metrics interface for future use
// interface PerformanceMetrics {
//   lcp?: number;
//   fid?: number;
//   cls?: number;
//   fcp?: number;
//   ttfb?: number;
// }

export const usePerformance = () => {
  const reportMetric = useCallback((name: string, value: number) => {
    if (typeof window !== "undefined" && "performance" in window) {
      // Report to analytics or monitoring service
      console.log(`Performance metric: ${name} = ${value}ms`);

      // You can integrate with services like:
      // - Google Analytics
      // - Vercel Analytics
      // - Custom monitoring solution
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("performance" in window)) {
      return;
    }

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          reportMetric("LCP", entry.startTime);
        } else if (entry.entryType === "first-input") {
          const fidEntry = entry as PerformanceEventTiming;
          reportMetric("FID", fidEntry.processingStart - fidEntry.startTime);
        } else if (entry.entryType === "layout-shift") {
          const clsEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!clsEntry.hadRecentInput) {
            reportMetric("CLS", clsEntry.value || 0);
          }
        } else if (entry.entryType === "paint") {
          if (entry.name === "first-contentful-paint") {
            reportMetric("FCP", entry.startTime);
          }
        } else if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;
          reportMetric("TTFB", navEntry.responseStart - navEntry.requestStart);
        }
      }
    });

    try {
      observer.observe({
        entryTypes: [
          "largest-contentful-paint",
          "first-input",
          "layout-shift",
          "paint",
          "navigation",
        ],
      });
    } catch {
      // Fallback for browsers that don't support all entry types
      console.warn("Performance monitoring not fully supported");
    }

    return () => {
      observer.disconnect();
    };
  }, [reportMetric]);

  return {
    reportMetric,
  };
};
