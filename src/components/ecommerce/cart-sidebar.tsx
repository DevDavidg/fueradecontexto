"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format-currency";
import Link from "next/link";

export const CartSidebar = () => {
  const { cart, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div aria-live="polite" className="relative">
      <button
        className="px-3 py-2 text-sm rounded-md border border-neutral-200"
        onClick={() => setOpen(true)}
        aria-label="Abrir carrito"
      >
        Carrito ({cart.items.length})
      </button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
          />
          <aside className="absolute right-0 top-0 h-full w-[360px] max-w-[90vw] bg-white border-l border-neutral-200 shadow-xl p-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Tu carrito</h2>
              <button
                className="text-sm underline"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
              >
                Cerrar
              </button>
            </div>
            <ul className="mt-4 space-y-3">
              {cart.items.length === 0 && (
                <li className="text-sm text-neutral-600">
                  Aún no agregaste productos
                </li>
              )}
              {cart.items.map((item) => (
                <li
                  key={`${item.productId}-${item.selectedSize}-${item.customization?.printSizeId}-${item.customization?.colorName}`}
                  className="border border-neutral-200 rounded-md p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {item.quantity}u
                        {item.selectedSize ? ` · ${item.selectedSize}` : ""}
                        {item.customization
                          ? ` · ${item.customization.printSizeId} · ${item.customization.colorName}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {formatCurrency(
                          item.price + (item.customization?.extraCost ?? 0),
                          item.currency
                        )}
                      </p>
                      <button
                        className="text-xs underline"
                        onClick={() => removeItem(item.productId)}
                        aria-label="Quitar"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center w-full h-10 rounded-md bg-black text-white text-sm"
              aria-label="Ir al checkout"
            >
              Ir a pagar
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};
