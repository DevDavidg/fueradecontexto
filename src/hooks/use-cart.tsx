"use client";

import { type ReactNode } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type CartItem, type CartState, type Product } from "@/lib/types";

type CartContextValue = {
  cart: CartState;
  pendingOrder: CartItem[];
  addItem: (
    product: Product,
    selectedSize?: CartItem["selectedSize"],
    customization?: CartItem["customization"],
    quantity?: number
  ) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setPendingOrder: (items: CartItem[]) => void;
  clearPendingOrder: () => void;
};

type CartStore = CartState & {
  pendingOrder: CartItem[];
  addItem: CartContextValue["addItem"];
  removeItem: CartContextValue["removeItem"];
  clearCart: CartContextValue["clearCart"];
  setPendingOrder: CartContextValue["setPendingOrder"];
  clearPendingOrder: CartContextValue["clearPendingOrder"];
};

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      pendingOrder: [],
      addItem: (product, selectedSize, customization, quantity = 1) => {
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
      setPendingOrder: (items) =>
        set({
          pendingOrder: items.map((item) => ({
            ...item,
            customization: item.customization
              ? {
                  printSizeId: item.customization.printSizeId,
                  printPlacement: item.customization.printPlacement,
                  colorName: item.customization.colorName,
                  colorHex: item.customization.colorHex,
                  extraCost: item.customization.extraCost,
                }
              : undefined,
          })),
        }),
      clearPendingOrder: () => set({ pendingOrder: [] }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        pendingOrder: state.pendingOrder,
      }),
      version: 2,
    }
  )
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const pendingOrder = useCartStore((s) => s.pendingOrder);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const setPendingOrder = useCartStore((s) => s.setPendingOrder);
  const clearPendingOrder = useCartStore((s) => s.clearPendingOrder);
  return {
    cart: { items },
    pendingOrder,
    addItem,
    removeItem,
    clearCart,
    setPendingOrder,
    clearPendingOrder,
  } satisfies CartContextValue;
};
