import { useState, useEffect } from "react";
import { useLogger } from "@/hooks/use-logger";

interface AdminStats {
  overview: {
    totalProducts: number;
    totalUsers: number;
    totalCategories: number;
    productsInStock: number;
    productsOutOfStock: number;
    totalInventoryValue: number;
    productsThisMonth: number;
    usersThisMonth: number;
  };
  popularProducts: Array<{
    id: string;
    stock: number;
    price: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    count: number;
  }>;
  lastUpdated: string;
}

export const useAdminStats = () => {
  const logger = useLogger();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/stats");

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      logger.error("Error fetching admin stats", err, {
        component: "useAdminStats",
        action: "fetchStats",
      });
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refreshStats = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refreshStats,
  };
};
