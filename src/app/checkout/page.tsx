"use client";

import { Navbar } from "@/components/organisms/navbar";
import { MercadoPagoPaymentForm } from "@/components/organisms/mercadopago-payment-form";
import { useCart } from "@/hooks/use-cart";
import { calculateCartTotals } from "@/lib/types";
import { formatCurrency } from "@/lib/format-currency";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { useEffect, useState } from "react";
import type { SectionsContent } from "@/lib/sections-server";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { subtotal } = calculateCartTotals(cart);
  const [content, setContent] = useState<SectionsContent["checkout"] | null>(
    null
  );
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/sections", { cache: "no-store" });
      const json: SectionsContent = await res.json();
      setContent(json?.checkout ?? null);
    };
    load();

    // Generar ID único para la orden
    setOrderId(
      `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    );
  }, []);

  const handleProceedToPayment = () => {
    if (cart.items.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentId: number) => {
    try {
      console.log(`Pago exitoso! ID: ${paymentId}`);

      // Reduce stock for each item in cart
      for (const item of cart.items) {
        const response = await fetch("/api/products/reduce-stock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
          }),
        });

        if (!response.ok) {
          console.error(`Failed to reduce stock for product ${item.productId}`);
        }
      }

      // Clear cart after successful payment
      clearCart();

      // Mostrar mensaje de éxito
      alert(
        "¡Pago exitoso! Recibirás un correo de confirmación. Ahora puedes enviar tu diseño personalizado."
      );

      // Abrir correo para enviar el diseño (si aplica)
      const subject = encodeURIComponent(
        content?.procesoPago?.asuntoEmail ??
          "Pedido Fueradecontexto - Envío de estampa"
      );
      const body = encodeURIComponent(
        content?.procesoPago?.cuerpoEmail ??
          `Hola! Mi número de orden es ${orderId}. Adjunto mi estampa para personalizar el pedido.`
      );
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    } catch (error) {
      console.error("Error after payment:", error);
      alert(
        "Pago procesado, pero ocurrió un error. Por favor, contacta al soporte."
      );
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment error:", error);
    alert(`Error al procesar el pago: ${error.message}`);
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        {!showPaymentForm ? (
          // Vista del resumen del carrito
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-2">
              {!content ? (
                <div className="h-7 w-40 bg-neutral-800 rounded animate-pulse" />
              ) : (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {content?.titles?.tituloPrincipal ?? "Checkout"}
                </h1>
              )}
              <ul className="mt-4 space-y-4">
                {cart.items.length === 0 && (
                  <li className="text-sm text-neutral-400">
                    {content?.carritoVacio ?? "Tu carrito está vacío."}
                  </li>
                )}
                {cart.items.map((item) => (
                  <li
                    key={`${item.productId}-${item.selectedSize}-${item.customization?.printSizeId}-${item.customization?.colorName}`}
                    className="border border-[#333333] rounded-lg p-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          title={item.name}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">
                          Cant: {item.quantity}
                          {item.selectedSize
                            ? ` · Talle ${item.selectedSize}`
                            : ""}
                          {item.customization
                            ? ` · Estampa ${item.customization.printSizeId} · ${item.customization.colorName}`
                            : ""}
                        </p>
                      </div>
                      <p className="text-sm font-medium shrink-0">
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
              {!content ? (
                <div className="space-y-3 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-neutral-800 rounded" />
                    <div className="h-4 w-24 bg-neutral-800 rounded" />
                  </div>
                  <div className="h-9 w-full bg-neutral-800 rounded" />
                  <div className="h-3 w-3/4 bg-neutral-900 rounded" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">
                      {content?.resumen?.subtotal ?? "Subtotal"}
                    </p>
                    <p className="text-sm font-medium">
                      {formatCurrency(
                        subtotal,
                        cart.items[0]?.currency ?? "USD"
                      )}
                    </p>
                  </div>
                  <button
                    className="mt-4 w-full px-4 py-2 rounded-md bg-[#C2187A] text-white text-sm hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleProceedToPayment}
                    aria-label="Proceder al pago"
                    disabled={cart.items.length === 0}
                  >
                    {content?.resumen?.botonPagar ?? "Proceder al Pago"}
                  </button>
                  <p className="text-xs text-neutral-400 mt-2">
                    Pago seguro con Mercado Pago
                  </p>
                </>
              )}
            </aside>
          </div>
        ) : (
          // Vista del formulario de pago
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">
                Finalizar Compra
              </h1>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-sm text-neutral-400 hover:text-white"
              >
                ← Volver al carrito
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulario de pago */}
              <div className="lg:col-span-2">
                <MercadoPagoPaymentForm
                  amount={subtotal}
                  orderId={orderId}
                  email="test@test.com"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>

              {/* Resumen de la orden */}
              <aside className="lg:col-span-1">
                <div className="border border-[#333333] rounded-lg p-4 sticky top-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Resumen de Compra
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">
                        Artículos ({cart.items.length})
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          subtotal,
                          cart.items[0]?.currency ?? "USD"
                        )}
                      </span>
                    </div>
                    <div className="border-t border-[#333333] pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-[#C2187A]">
                          {formatCurrency(
                            subtotal,
                            cart.items[0]?.currency ?? "USD"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#333333]">
                    <p className="text-xs text-neutral-400">
                      ID de Orden: {orderId}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
