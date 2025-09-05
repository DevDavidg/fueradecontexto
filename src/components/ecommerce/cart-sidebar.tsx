"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format-currency";
import Link from "next/link";

export const CartSidebar = () => {
  const { cart, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!open) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} aria-live="polite" className="relative">
      <button
        className="relative inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#333333] text-[#ededed]"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir carrito"
        aria-expanded={open}
      >
        🛒
        {cart.items.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#C2187A] text-[10px] leading-none">
            {cart.items.length}
          </span>
        )}
      </button>
      <aside
        aria-hidden={!open}
        className={
          "absolute right-0 mt-2 z-[1000] w-80 max-h-[60vh] overflow-auto bg-[#0a0a0a] text-[#ededed] border border-[#333333] rounded-md shadow-xl p-4 transition duration-200 ease-out transform origin-top-right " +
          (open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none")
        }
        style={{ willChange: "transform, opacity" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Tu carrito</h2>
          <button
            className="text-xs underline"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>
        <ul className="mt-3 space-y-3">
          {cart.items.length === 0 && (
            <li className="text-sm text-neutral-400">
              Aún no agregaste productos
            </li>
          )}
          {cart.items.map((item) => (
            <li
              key={`${item.productId}-${item.selectedSize}-${item.customization?.printSizeId}-${item.customization?.colorName}`}
              className="border border-[#333333] rounded-md p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
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
          className="mt-4 inline-flex items-center justify-center w-full h-10 rounded-md bg-[#C2187A] hover:bg-pink-700 text-white text-sm"
          aria-label="Ir al checkout"
        >
          Ir a pagar
        </Link>
      </aside>
    </div>
  );
};
