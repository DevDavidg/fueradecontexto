"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { calculateCartTotals } from "@/lib/types";

export const CheckoutSummary = () => {
  const { cart, clearCart } = useCart();
  const { subtotal } = useMemo(() => calculateCartTotals(cart), [cart]);
  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <aside className="w-full md:w-80 shrink-0 border border-neutral-200 rounded-lg p-4 h-fit sticky top-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">Artículos</p>
        <p className="text-sm font-medium">{itemCount}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-neutral-600">Subtotal</p>
        <p className="text-sm font-medium">${subtotal.toFixed(2)} USD</p>
      </div>
      <Button className="mt-4 w-full" aria-label="Proceed to checkout">
        Checkout
      </Button>
      <Button
        variant="secondary"
        className="mt-2 w-full"
        onClick={clearCart}
        aria-label="Clear cart"
      >
        Vaciar carrito
      </Button>
    </aside>
  );
};
