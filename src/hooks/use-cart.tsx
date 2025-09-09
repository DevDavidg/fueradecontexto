"use client";

import { createContext, type ReactNode } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type CartItem, type CartState, type Product } from "@/lib/types";

type CartContextValue = {
  cart: CartState;
  addItem: (
    product: Product,
    selectedSize?: CartItem["selectedSize"],
    quantity?: number,
    customization?: CartItem["customization"]
  ) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

type CartStore = CartState & {
  addItem: CartContextValue["addItem"];
  removeItem: CartContextValue["removeItem"];
  clearCart: CartContextValue["clearCart"];
};

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, selectedSize, quantity = 1, customization) => {
        set((prev) => {
          const existing = prev.items.find(
            (i) =>
              i.productId === product.id &&
              i.selectedSize === selectedSize &&
              JSON.stringify(i.customization) === JSON.stringify(customization)
          );
          if (existing) {
            const updated = prev.items.map((i) =>
              i.productId === product.id &&
              i.selectedSize === selectedSize &&
              JSON.stringify(i.customization) === JSON.stringify(customization)
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
            return { items: updated };
          }
          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            currency: product.currency,
            quantity,
            imageUrl: product.imageUrl,
            selectedSize,
            customization: customization
              ? {
                  printSizeId: customization.printSizeId,
                  colorName: customization.colorName,
                  colorHex: customization.colorHex,
                  extraCost: customization.extraCost,
                }
              : undefined,
          };
          return { items: [...prev.items, newItem] };
        });
      },
      removeItem: (productId) =>
        set((prev) => ({
          items: prev.items.filter((i) => i.productId !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      version: 1,
    }
  )
);

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Mantener Provider para evitar cambios de uso; delega en Zustand
  const value: CartContextValue = {
    cart: { items: useCartStore.getState().items },
    addItem: useCartStore.getState().addItem,
    removeItem: useCartStore.getState().removeItem,
    clearCart: useCartStore.getState().clearCart,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  // Seleccionar estado reactivo desde Zustand para re-render mínimos
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  return {
    cart: { items },
    addItem,
    removeItem,
    clearCart,
  } satisfies CartContextValue;
};
