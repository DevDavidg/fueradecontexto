"use client";

import { createContext, type ReactNode } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Product, type ColorOption } from "@/lib/types";

type FavoriteItem = Product & {
  selectedColor?: ColorOption;
};

type FavoritesState = {
  items: FavoriteItem[];
};

type FavoritesContextValue = {
  favorites: FavoritesState;
  addToFavorites: (product: Product, selectedColor?: ColorOption) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
};

type FavoritesStore = FavoritesState & {
  addToFavorites: FavoritesContextValue["addToFavorites"];
  removeFromFavorites: FavoritesContextValue["removeFromFavorites"];
  isFavorite: FavoritesContextValue["isFavorite"];
  clearFavorites: FavoritesContextValue["clearFavorites"];
};

const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToFavorites: (product, selectedColor) => {
        set((prev) => {
          const isAlreadyFavorite = prev.items.some(
            (item) => item.id === product.id
          );
          if (isAlreadyFavorite) {
            return prev;
          }
          return {
            items: [...prev.items, { ...product, selectedColor }],
          };
        });
      },
      removeFromFavorites: (productId) => {
        set((prev) => ({
          items: prev.items.filter((item) => item.id !== productId),
        }));
      },
      isFavorite: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: "favorites-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      version: 1,
    }
  )
);

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FavoritesContext.Provider value={null}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const items = useFavoritesStore((s) => s.items);
  const addToFavorites = useFavoritesStore((s) => s.addToFavorites);
  const removeFromFavorites = useFavoritesStore((s) => s.removeFromFavorites);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  return {
    favorites: { items },
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
  } satisfies FavoritesContextValue;
};
