"use client";

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CartProvider } from "@/hooks/use-cart";
import { FavoritesProvider } from "@/hooks/use-favorites";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </CartProvider>
      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};
