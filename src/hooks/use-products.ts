"use client";

import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";
import { type Product } from "@/lib/types";

export const useProducts = () => {
  const query = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => productsService.getAll(),
    staleTime: 1000 * 60,
  });
  return query;
};
