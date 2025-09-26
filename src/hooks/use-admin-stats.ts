import { useReducer, useEffect, useCallback } from "react";

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

interface AdminStatsState {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
}

type AdminStatsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: AdminStats }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "RESET_ERROR" };

const initialState: AdminStatsState = {
  stats: null,
  loading: true,
  error: null,
};

const adminStatsReducer = (
  state: AdminStatsState,
  action: AdminStatsAction
): AdminStatsState => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        stats: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "RESET_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const useAdminStats = () => {
  const [state, dispatch] = useReducer(adminStatsReducer, initialState);

  const fetchStats = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_START" });

      const response = await fetch("/api/admin/stats");

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      // Log error to console in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching admin stats:", err);
      }
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      dispatch({ type: "FETCH_ERROR", payload: errorMessage });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        dispatch({ type: "FETCH_START" });

        const response = await fetch("/api/admin/stats");

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (isMounted) {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        }
      } catch (err) {
        if (isMounted) {
          if (process.env.NODE_ENV === "development") {
            console.error("Error fetching admin stats:", err);
          }
          const errorMessage =
            err instanceof Error ? err.message : "Error desconocido";
          dispatch({ type: "FETCH_ERROR", payload: errorMessage });
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    refreshStats,
  };
};
