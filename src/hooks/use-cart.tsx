"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartState>({ items: [] });

  const addItem: CartContextValue["addItem"] = (
    product,
    selectedSize,
    quantity = 1,
    customization
  ) => {
    setCart((prev) => {
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
  };

  const removeItem: CartContextValue["removeItem"] = (productId) => {
    setCart((prev) => ({
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  };

  const clearCart = () => setCart({ items: [] });

  const value = useMemo<CartContextValue>(
    () => ({ cart, addItem, removeItem, clearCart }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
