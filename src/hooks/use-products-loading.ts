import { useState, useEffect } from "react";
import { useProducts } from "./use-products";

export const useProductsLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Hook para obtener todos los productos (sin categoría específica)
  const { data: allProducts, isLoading: allProductsLoading } = useProducts();

  // Hook para cada categoría
  const { isLoading: buzosLoading } = useProducts("buzos");
  const { isLoading: camperasLoading } = useProducts("camperas");
  const { isLoading: gorrasLoading } = useProducts("gorras");
  const { isLoading: totebagsLoading } = useProducts("totebags");

  useEffect(() => {
    const loadingStates = [
      allProductsLoading,
      buzosLoading,
      camperasLoading,
      gorrasLoading,
      totebagsLoading,
    ];

    const totalCategories = loadingStates.length;
    const loadedCategories = loadingStates.filter((state) => !state).length;
    const progress = (loadedCategories / totalCategories) * 100;

    setLoadingProgress(progress);

    // Consideramos que está cargando si al menos una categoría está cargando
    const stillLoading = loadingStates.some((state) => state);
    setIsLoading(stillLoading);
  }, [
    allProductsLoading,
    buzosLoading,
    camperasLoading,
    gorrasLoading,
    totebagsLoading,
  ]);

  return {
    isLoading,
    loadingProgress,
    allProducts,
  };
};
