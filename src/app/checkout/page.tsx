"use client";

import { Navbar } from "@/components/organisms/navbar";
import { useCart } from "@/hooks/use-cart";
import { calculateCartTotals } from "@/lib/types";
import { formatCurrency } from "@/lib/format-currency";
import { useEffect, useRef, useState } from "react";
import type { SectionsContent } from "@/lib/sections-server";
import { Modal } from "@/components/ui/modal";

export default function CheckoutPage() {
  const { cart, setPendingOrder } = useCart();
  const { subtotal } = calculateCartTotals(cart);
  const [content, setContent] = useState<SectionsContent["checkout"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isPollingPayment, setIsPollingPayment] = useState(false);
  const [activePreferenceId, setActivePreferenceId] = useState<string | null>(
    null
  );
  const [pollError, setPollError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const attemptOrderConfirmation = async (preferenceId: string) => {
    try {
      const response = await fetch("/api/checkout/save-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferenceId,
        }),
      });

      if (response.ok) {
        return { success: true };
      }

      const data = await response.json().catch(() => null);
      return {
        success: false,
        message:
          data?.error === "Payment is not approved"
            ? "Mercado Pago aún está procesando el pago."
            : data?.error || "No pudimos confirmar el pago todavía.",
      };
    } catch {
      return {
        success: false,
        message: "Error de red al verificar el pago. Inténtalo nuevamente.",
      };
    }
  };

  const startPaymentPolling = (preferenceId: string) => {
    setPollError(null);
    setIsPollingPayment(true);
    setActivePreferenceId(preferenceId);

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    let attempts = 0;
    const maxAttempts = 60;

    const intervalId = setInterval(async () => {
      attempts += 1;
      const result = await attemptOrderConfirmation(preferenceId);

      if (result.success) {
        clearInterval(intervalId);
        pollingIntervalRef.current = null;
        setIsPollingPayment(false);
        globalThis.location.href = `/checkout/success?preference-id=${preferenceId}&status=approved`;
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        pollingIntervalRef.current = null;
        setIsPollingPayment(false);
        setPollError(
          result.message ??
            "No pudimos confirmar el pago automáticamente. Si ya pagaste, usá “Ya pagué”."
        );
      }
    }, 5000);

    pollingIntervalRef.current = intervalId;
  };

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/sections", { cache: "no-store" });
      const json: SectionsContent = await res.json();
      setContent(json?.checkout ?? null);
    };
    load();
  }, []);

  const handlePay = async () => {
    if (cart.items.length === 0) {
      setPendingOrder([]);
      return;
    }

    setPendingOrder(cart.items);

    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData.error || "Failed to create payment preference"
        );
      }

      const { initPoint, preferenceId } = await response.json();
      console.log("Preference created:", { initPoint, preferenceId });

      if (preferenceId) {
        localStorage.setItem("mercadopago_preference_id", preferenceId);
      }

      if (initPoint) {
        setPaymentUrl(initPoint);
        setShowModal(true);
      } else {
        throw new Error("No payment URL received from Mercado Pago");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(
        `Error al procesar el pago: ${
          error instanceof Error ? error.message : "Error desconocido"
        }. Por favor, inténtalo de nuevo.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          {content ? (
            <h1 className="text-2xl font-semibold tracking-tight">
              {content?.titles?.tituloPrincipal ?? "Checkout"}
            </h1>
          ) : (
            <div className="h-7 w-40 bg-neutral-800 rounded animate-pulse" />
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
                      {item.selectedSize ? ` · Talle ${item.selectedSize}` : ""}
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
          {content ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-400">
                  {content?.resumen?.subtotal ?? "Subtotal"}
                </p>
                <p className="text-sm font-medium">
                  {formatCurrency(subtotal, cart.items[0]?.currency ?? "ARS")}
                </p>
              </div>
              <button
                className="mt-4 w-full px-4 py-2 rounded-md bg-[#C2187A] text-white text-sm hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePay}
                aria-label="Pagar"
                disabled={cart.items.length === 0 || isLoading}
              >
                {isLoading
                  ? "Procesando..."
                  : content?.resumen?.botonPagar ?? "Pagar"}
              </button>
              <p className="text-xs text-neutral-400 mt-2">
                {content?.resumen?.descripcionPago ??
                  "Tras pagar serás redirigido a Mercado Pago para completar el pago."}{" "}
              </p>
            </>
          ) : (
            <div className="space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-neutral-800 rounded" />
                <div className="h-4 w-24 bg-neutral-800 rounded" />
              </div>
              <div className="h-9 w-full bg-neutral-800 rounded" />
              <div className="h-3 w-3/4 bg-neutral-900 rounded" />
            </div>
          )}
        </aside>
      </main>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Proceder al pago"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-400">
            Serás redirigido a Mercado Pago para completar tu pago de forma
            segura.
          </p>
          <div className="flex gap-3">
            {isPollingPayment ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border border-[#333333] bg-neutral-900/60 px-4 py-3 text-center">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <p className="text-xs text-neutral-300">
                    Esperando confirmación de Mercado Pago...
                  </p>
                </div>
                <div className="flex w-full gap-2">
                  <button
                    onClick={() => {
                      if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                      }
                      setIsPollingPayment(false);
                      setShowModal(false);
                    }}
                    className="flex-1 rounded-md border border-[#555555] px-3 py-2 text-xs text-neutral-300 hover:border-neutral-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      if (!activePreferenceId) return;
                      const result = await attemptOrderConfirmation(
                        activePreferenceId
                      );
                      if (result.success) {
                        if (pollingIntervalRef.current) {
                          clearInterval(pollingIntervalRef.current);
                          pollingIntervalRef.current = null;
                        }
                        setIsPollingPayment(false);
                        globalThis.location.href = `/checkout/success?preference-id=${activePreferenceId}&status=approved`;
                      } else {
                        setPollError(
                          result.message ??
                            "No pudimos confirmar el pago todavía. Intentá nuevamente en unos segundos."
                        );
                      }
                    }}
                    className="flex-1 rounded-md bg-[#C2187A] px-3 py-2 text-xs font-semibold text-white hover:bg-pink-700"
                  >
                    Ya pagué
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500">
                  Si Mercado Pago ya muestra “Pago acreditado”, podés usar el
                  botón “Ya pagué” para continuar.
                </p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!paymentUrl) return;

                    const savedPreferenceId = localStorage.getItem(
                      "mercadopago_preference_id"
                    );
                    if (!savedPreferenceId) {
                      setPollError(
                        "No se pudo iniciar el seguimiento del pago. Reintenta."
                      );
                      return;
                    }

                    startPaymentPolling(savedPreferenceId);
                    globalThis.location.href = paymentUrl;
                  }}
                  className="flex-1 px-4 py-2 rounded-md bg-[#C2187A] text-white text-center hover:bg-pink-700 transition-colors"
                >
                  Ir a Mercado Pago
                </button>
              </>
            )}
          </div>
          {pollError && (
            <p className="text-xs text-red-400 text-center">{pollError}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
