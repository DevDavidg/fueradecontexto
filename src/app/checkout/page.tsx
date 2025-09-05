"use client";

import { Navbar } from "@/components/molecules/navbar";
import { useCart } from "@/hooks/use-cart";
import { calculateCartTotals } from "@/lib/types";
import { formatCurrency } from "@/lib/format-currency";
import { SUPPORT_EMAIL } from "@/lib/constants";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { subtotal } = calculateCartTotals(cart);

  const handlePay = () => {
    clearCart();
    const subject = encodeURIComponent(
      "Pedido Fueradecontexto - Envío de estampa"
    );
    const body = encodeURIComponent(
      "Hola! Adjunto mi estampa para personalizar el pedido."
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
          <ul className="mt-4 space-y-4">
            {cart.items.length === 0 && (
              <li className="text-sm text-neutral-400">
                Tu carrito está vacío.
              </li>
            )}
            {cart.items.map((item) => (
              <li
                key={`${item.productId}-${item.selectedSize}-${item.customization?.printSizeId}-${item.customization?.colorName}`}
                className="border border-[#333333] rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-400">
                      Cant: {item.quantity}
                      {item.selectedSize ? ` · Talle ${item.selectedSize}` : ""}
                      {item.customization
                        ? ` · Estampa ${item.customization.printSizeId} · ${item.customization.colorName}`
                        : ""}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(
                      (item.price + (item.customization?.extraCost ?? 0)) *
                        item.quantity,
                      item.currency
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <aside className="md:col-span-1 border border-[#333333] rounded-lg p-4 h-fit sticky top-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">Subtotal</p>
            <p className="text-sm font-medium">
              {formatCurrency(subtotal, cart.items[0]?.currency ?? "USD")}
            </p>
          </div>
          <button
            className="mt-4 w-full px-4 py-2 rounded-md bg-[#C2187A] text-white text-sm hover:bg-pink-700"
            onClick={handlePay}
            aria-label="Pagar"
            disabled={cart.items.length === 0}
          >
            Pagar
          </button>
          <p className="text-xs text-neutral-400 mt-2">
            Tras pagar se abrirá tu correo para enviar el diseño a{" "}
            {SUPPORT_EMAIL}.
          </p>
        </aside>
      </main>
    </div>
  );
}
