"use client";

import { useState, useEffect } from "react";
import { type StampOption } from "@/lib/types";

type StampPricingData = {
  printSizes: Array<{
    id: string;
    size_key: string;
    price: number;
  }>;
  stampOptions: Array<{
    id: string;
    placement: string;
    size_id: string;
    label: string;
    extra_cost: number;
  }>;
};

export const useStampOptions = () => {
  const [stampOptions, setStampOptions] = useState<StampOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStampOptions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/stamp-pricing");

        if (!response.ok) {
          throw new Error("Failed to fetch stamp options");
        }

        const result = await response.json();
        const data: StampPricingData = result.data;

        // Transform API data to StampOption format
        const formattedOptions: StampOption[] = data.stampOptions.map(
          (option) => ({
            id: option.id,
            placement: option.placement as "front" | "back" | "front_back",
            size: option.size_id as
              | "hasta_15cm"
              | "hasta_20x30cm"
              | "hasta_30x40cm"
              | "hasta_40x50cm",
            label: option.label,
            extraCost: option.extra_cost,
          })
        );

        setStampOptions(formattedOptions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching stamp options:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStampOptions();
  }, []);

  return {
    stampOptions,
    isLoading,
    error,
  };
};

export default useStampOptions;
