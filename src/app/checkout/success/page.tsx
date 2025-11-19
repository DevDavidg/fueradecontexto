"use client";

import { Navbar } from "@/components/organisms/navbar";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format-currency";
import { calculateCartTotals } from "@/lib/types";
import { SUPPORT_EMAIL } from "@/lib/constants";
import type { SectionsContent } from "@/lib/sections-server";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";

function CheckoutSuccessContent() {
  const { clearCart, pendingOrder, clearPendingOrder } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState<SectionsContent["checkout"] | null>(
    null
  );
  // Guardar los items del pedido en estado local antes de limpiar pendingOrder
  const [orderItems, setOrderItems] = useState<typeof pendingOrder>([]);
  const itemsSavedRef = useRef(false);
  const clearedRef = useRef(false);
  const emailSentRef = useRef(false);

  const status = searchParams.get("status")?.toLowerCase() ?? "";
  const collectionStatus =
    searchParams.get("collection_status")?.toLowerCase() ?? "";
  const paymentId =
    searchParams.get("payment_id") || searchParams.get("payment-id");
  const preferenceId =
    searchParams.get("preference_id") || searchParams.get("preference-id");
  const orderSavedRef = useRef(false);

  // Guardar los items del pedido INMEDIATAMENTE al montar el componente
  // antes de que se limpien en el otro useEffect
  useEffect(() => {
    console.log("[DEBUG] useEffect - pendingOrder changed:", {
      pendingOrderLength: pendingOrder.length,
      pendingOrder,
      itemsSavedRef: itemsSavedRef.current,
      currentOrderItemsLength: orderItems.length,
    });

    if (!itemsSavedRef.current && pendingOrder.length > 0) {
      console.log("[DEBUG] Saving items from pendingOrder:", pendingOrder);
      setOrderItems([...pendingOrder]);
      itemsSavedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOrder]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/sections", { cache: "no-store" });
      const json: SectionsContent = await res.json();
      setContent(json?.checkout ?? null);
    };
    load();
  }, []);

  useEffect(() => {
    if (clearedRef.current) return;

    const approvedStatuses = new Set(["approved", "success"]);
    const pathname = window.location.pathname;
    const isFromMercadoPago =
      pathname.includes("congrats") || pathname.includes("approved");
    const isApproved =
      isFromMercadoPago ||
      approvedStatuses.has(status) ||
      approvedStatuses.has(collectionStatus) ||
      (preferenceId && !status && !collectionStatus);

    console.log("[DEBUG] Clear cart useEffect:", {
      isApproved,
      status,
      collectionStatus,
      preferenceId,
      pendingOrderLength: pendingOrder.length,
      orderItemsLength: orderItems.length,
      itemsSavedRef: itemsSavedRef.current,
    });

    if (isApproved) {
      // Asegurarse de que los items estén guardados antes de limpiar
      if (!itemsSavedRef.current && pendingOrder.length > 0) {
        console.log("[DEBUG] Saving items before clearing:", pendingOrder);
        setOrderItems([...pendingOrder]);
        itemsSavedRef.current = true;
      }

      clearCart();
      clearPendingOrder();
      localStorage.removeItem("mercadopago_preference_id");
      clearedRef.current = true;

      console.log("[DEBUG] Cart and pendingOrder cleared");
    }
  }, [
    clearCart,
    clearPendingOrder,
    status,
    collectionStatus,
    preferenceId,
    pendingOrder,
    orderItems,
  ]);

  const sendEmail = useCallback(() => {
    const subject = encodeURIComponent(
      content?.procesoPago?.asuntoEmail ??
        "Pedido Fueradecontexto - Envío de estampa"
    );
    const body = encodeURIComponent(
      content?.procesoPago?.cuerpoEmail ??
        "Hola! Adjunto mi estampa para personalizar el pedido."
    );
    globalThis.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }, [content]);

  useEffect(() => {
    const saveOrder = async () => {
      if (orderSavedRef.current) return;

      const approvedStatuses = new Set(["approved", "success"]);
      const pathname = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      const urlPreferenceId =
        urlParams.get("preference-id") || urlParams.get("preference_id");
      const urlPaymentId =
        urlParams.get("payment_id") || urlParams.get("payment-id");

      const isFromMercadoPago =
        pathname.includes("congrats") ||
        pathname.includes("approved") ||
        status === "approved" ||
        collectionStatus === "approved" ||
        urlPreferenceId !== null;

      const isApproved =
        isFromMercadoPago ||
        approvedStatuses.has(status) ||
        approvedStatuses.has(collectionStatus) ||
        urlPreferenceId !== null;

      if (!isApproved && status && collectionStatus && !isFromMercadoPago) {
        return;
      }

      orderSavedRef.current = true;

      const effectivePreferenceId =
        preferenceId ||
        urlPreferenceId ||
        localStorage.getItem("mercadopago_preference_id");
      const effectivePaymentId = paymentId || urlPaymentId;

      if (!effectivePaymentId && !effectivePreferenceId) {
        console.warn(
          "No payment ID or preference ID found. URL:",
          window.location.href
        );
        return;
      }

      const itemsToSave =
        orderItems.length > 0
          ? orderItems
          : pendingOrder.length > 0
          ? pendingOrder
          : undefined;

      try {
        const response = await fetch("/api/checkout/save-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId: effectivePaymentId,
            preferenceId: effectivePreferenceId,
            items: itemsToSave,
            externalRef:
              effectivePreferenceId ||
              effectivePaymentId ||
              `order_${Date.now()}`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error saving order:", errorData);
        } else {
          const result = await response.json();
          console.log("Order saved successfully:", result);

          // Si no tenemos items y la orden se guardó exitosamente,
          // intentar obtener los items desde la orden guardada
          if (
            orderItems.length === 0 &&
            pendingOrder.length === 0 &&
            result.orderId
          ) {
            try {
              const ordersResponse = await fetch("/api/admin/orders");
              if (ordersResponse.ok) {
                const ordersData = (await ordersResponse.json()) as {
                  orders?: Array<{
                    id: string;
                    mercadopago_payment_id: number | string;
                    external_reference?: string;
                    items?: Array<{
                      productId?: string;
                      name?: string;
                      price: number | string;
                      currency?: string;
                      quantity: number | string;
                      selectedSize?: string;
                      customization?: unknown;
                      imageUrl?: string;
                    }>;
                  }>;
                };
                const savedOrder = ordersData.orders?.find(
                  (o) =>
                    o.id === result.orderId ||
                    String(o.mercadopago_payment_id) ===
                      String(effectivePaymentId) ||
                    o.external_reference?.includes(
                      effectivePreferenceId?.split("-")[0] || ""
                    )
                );
                if (savedOrder?.items && savedOrder.items.length > 0) {
                  // Convertir los items de la orden guardada al formato esperado
                  const convertedItems = savedOrder.items.map((item) => {
                    const custom = item.customization as
                      | {
                          printSizeId?: string;
                          printPlacement?: string;
                          colorName?: string;
                          colorHex?: string;
                          extraCost?: number;
                        }
                      | undefined;

                    return {
                      productId: item.productId || "",
                      name: item.name || "",
                      price:
                        typeof item.price === "string"
                          ? Number.parseFloat(item.price)
                          : item.price,
                      currency: (item.currency || "ARS") as
                        | "ARS"
                        | "USD"
                        | "EUR",
                      quantity:
                        typeof item.quantity === "string"
                          ? Number.parseInt(item.quantity, 10)
                          : item.quantity,
                      imageUrl: item.imageUrl || "",
                      selectedSize: item.selectedSize as
                        | "XS"
                        | "S"
                        | "M"
                        | "L"
                        | "XL"
                        | "XXL"
                        | "Único"
                        | undefined,
                      customization:
                        custom &&
                        custom.printSizeId &&
                        custom.colorName &&
                        custom.colorHex !== undefined &&
                        custom.extraCost !== undefined
                          ? {
                              printSizeId: custom.printSizeId as
                                | "hasta_15cm"
                                | "hasta_20x30cm"
                                | "hasta_30x40cm"
                                | "hasta_40x50cm",
                              printPlacement: custom.printPlacement as
                                | "front"
                                | "back"
                                | "front_back"
                                | undefined,
                              colorName: custom.colorName,
                              colorHex: custom.colorHex,
                              extraCost: custom.extraCost,
                            }
                          : undefined,
                    };
                  });
                  setOrderItems(convertedItems);
                }
              }
            } catch (err) {
              console.error("Error fetching saved order items:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error saving order:", error);
      }
    };

    const timeout = setTimeout(() => {
      saveOrder();
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    paymentId,
    preferenceId,
    status,
    collectionStatus,
    orderItems,
    pendingOrder,
  ]);

  useEffect(() => {
    const itemsToUse = orderItems.length > 0 ? orderItems : pendingOrder;
    if (itemsToUse.length === 0) return;
    if (!content) return;
    if (emailSentRef.current) return;
    emailSentRef.current = true;
    sendEmail();
  }, [orderItems, pendingOrder, content, sendEmail]);

  const itemsToDisplay = orderItems.length > 0 ? orderItems : pendingOrder;

  // Debug logging
  useEffect(() => {
    console.log("[DEBUG] itemsToDisplay state:", {
      orderItemsLength: orderItems.length,
      pendingOrderLength: pendingOrder.length,
      itemsToDisplayLength: itemsToDisplay.length,
      orderItems,
      pendingOrder,
      itemsToDisplay,
    });
  }, [orderItems, pendingOrder, itemsToDisplay]);

  const subtotal = useMemo(() => {
    return calculateCartTotals({ items: itemsToDisplay }).subtotal;
  }, [itemsToDisplay]);

  const totalQuantity = useMemo(() => {
    return itemsToDisplay.reduce((sum, item) => sum + item.quantity, 0);
  }, [itemsToDisplay]);

  const currency = itemsToDisplay[0]?.currency ?? "ARS";

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 md:px-6 py-12">
        <div className="space-y-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">¡Pago exitoso!</h1>
            <p className="text-neutral-400 text-lg">
              Tu pago se acreditó correctamente. Enviá tu diseño respondiendo el
              correo que se abrió automáticamente o usando el botón siguiente.
            </p>
          </div>

          {itemsToDisplay.length > 0 ? (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Resumen del pedido</h2>
                <p className="text-sm text-neutral-400">
                  {totalQuantity}{" "}
                  {totalQuantity === 1 ? "producto" : "productos"}
                </p>
              </div>
              <ul className="space-y-4">
                {itemsToDisplay.map((item) => (
                  <li
                    key={`${item.productId}-${item.selectedSize}-${item.customization?.printSizeId}-${item.customization?.colorName}`}
                    className="border border-[#333333] rounded-lg p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-neutral-400">
                          Cant: {item.quantity}
                          {item.selectedSize
                            ? ` · Talle ${item.selectedSize}`
                            : ""}
                          {item.customization
                            ? ` · Estampa ${item.customization.printSizeId} · ${item.customization.colorName}`
                            : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-400">
                          {formatCurrency(
                            item.price + (item.customization?.extraCost ?? 0),
                            item.currency
                          )}{" "}
                          c/u
                        </p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(
                            (item.price +
                              (item.customization?.extraCost ?? 0)) *
                              item.quantity,
                            item.currency
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-[#333333] pt-4">
                <span className="text-sm text-neutral-400">Subtotal</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>
            </section>
          ) : (
            <section className="border border-[#333333] rounded-lg p-6 text-center text-sm text-neutral-400">
              No encontramos los productos del pedido. Si necesitás ayuda
              escribinos a {SUPPORT_EMAIL}.
            </section>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
            <button
              onClick={sendEmail}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#C2187A] text-white text-sm font-semibold hover:bg-pink-700 transition-colors"
            >
              Enviar diseño por correo
            </button>
            <button
              onClick={() => {
                clearPendingOrder();
                router.push("/");
              }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-[#333333] text-sm font-semibold hover:border-neutral-500 hover:text-white transition-colors"
            >
              Finalizar
            </button>
          </div>

          <div className="text-center text-sm text-neutral-500">
            <Link href="/" className="underline">
              Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-[#ededed]">
          <Navbar />
          <main className="mx-auto max-w-3xl px-4 md:px-6 py-12">
            <div className="text-center">
              <p className="text-neutral-400">Cargando...</p>
            </div>
          </main>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
