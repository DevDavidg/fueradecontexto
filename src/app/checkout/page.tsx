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
    // Simula pago exitoso
    alert(
      `Compra realizada. Envíanos tu estampa a ${SUPPORT_EMAIL} con tu número de pedido.`
    );
    clearCart();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
          <ul className="mt-4 space-y-4">
            {cart.items.length === 0 && (
              <li className="text-sm text-neutral-600">
                Tu carrito está vacío.
              </li>
            )}
            {cart.items.map((item) => (
              <li
                key={`${item.productId}-${item.selectedSize}-${item.customization?.printSizeId}-${item.customization?.colorName}`}
                className="border border-neutral-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-500">
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
        <aside className="md:col-span-1 border border-neutral-200 rounded-lg p-4 h-fit sticky top-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">Subtotal</p>
            <p className="text-sm font-medium">
              {formatCurrency(subtotal, cart.items[0]?.currency ?? "USD")}
            </p>
          </div>
          <button
            className="mt-4 w-full px-4 py-2 rounded-md bg-black text-white text-sm"
            onClick={handlePay}
            aria-label="Pagar"
            disabled={cart.items.length === 0}
          >
            Pagar
          </button>
          <p className="text-xs text-neutral-600 mt-2">
            Tras el pago, envía tu diseño a {SUPPORT_EMAIL}. Indica el número de
            pedido y detalles de estampa.
          </p>
        </aside>
      </main>
    </div>
  );
}
