"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";
import { type Product } from "@/lib/types";

export type ProductsPage = {
  items: Product[];
  nextPage: number | null;
  hasMore: boolean;
};

const PAGE_SIZE = 8;

export const useProducts = (categoria?: string) => {
  const query = useInfiniteQuery<ProductsPage>({
    queryKey: ["products", "infinite", PAGE_SIZE, categoria],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productsService.getPage({
        page: pageParam as number,
        pageSize: PAGE_SIZE,
        categoria,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60,
  });
  return query;
};

export const useProduct = (id: string | undefined) => {
  return useQuery<Product | undefined>({
    queryKey: ["product", id],
    enabled: Boolean(id),
    queryFn: () => productsService.getById(id as string),
    staleTime: 1000 * 60,
  });
};
