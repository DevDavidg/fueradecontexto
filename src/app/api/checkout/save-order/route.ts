import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateStockForOrder, sendOrderEmail } from "@/lib/order-utils";
import type {
  CheckoutItemPayload,
  MercadoPagoPayment,
  MercadoPagoPaymentItem,
  MercadoPagoPaymentSearchResponse,
} from "@/types/checkout";

type SaveOrderPayload = {
  paymentId?: string;
  preferenceId?: string;
  items?: CheckoutItemPayload[];
  externalRef?: string;
};

const mapPaymentItemToCheckout = (
  item: MercadoPagoPaymentItem,
  payment: MercadoPagoPayment
): CheckoutItemPayload => {
  const selectedSize = item.description?.match(/Talle (\w+)/)?.[1];
  const customizationMatch = item.description?.match(/Estampa (\w+)/)?.[1];
  const colorMatch = item.description?.match(/· (\w+)$/)?.[1];

  // Calcular el precio unitario correcto desde el total de la orden
  // para evitar discrepancias con el unit_price que viene de Mercado Pago
  const totalQuantity = payment.additional_info?.items?.reduce(
    (sum, i) => sum + i.quantity,
    0
  ) || item.quantity;
  
  // Si hay un solo item, usar el total de la transacción dividido por la cantidad
  // Esto asegura que el precio unitario sea correcto
  const calculatedUnitPrice = totalQuantity > 0 && payment.additional_info?.items?.length === 1
    ? payment.transaction_amount / totalQuantity
    : item.unit_price;

  return {
    productId: item.id,
    name: item.title,
    quantity: item.quantity,
    price: calculatedUnitPrice,
    currency: payment.currency_id,
    selectedSize,
    customization: customizationMatch
      ? {
          printSizeId: customizationMatch,
          colorName: colorMatch || "Estándar",
          extraCost: 0,
        }
      : undefined,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveOrderPayload;
    const { paymentId, preferenceId, items, externalRef } = body;

    if (!paymentId && !preferenceId) {
      return NextResponse.json(
        { error: "paymentId or preferenceId is required" },
        { status: 400 }
      );
    }

    let paymentData: MercadoPagoPayment | null = null;

    if (paymentId) {
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch payment: ${response.statusText}`);
      }

      paymentData = (await response.json()) as MercadoPagoPayment;
    }

    if (!paymentData && preferenceId) {
      const preferenceResponse = await fetch(
        `https://api.mercadopago.com/checkout/preferences/${preferenceId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (preferenceResponse.ok) {
        const paymentsResponse = await fetch(
          `https://api.mercadopago.com/v1/payments/search?preference_id=${preferenceId}&sort=date_created&criteria=desc&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
          }
        );

        if (paymentsResponse.ok) {
          const paymentsData =
            (await paymentsResponse.json()) as MercadoPagoPaymentSearchResponse;
          if (paymentsData.results && paymentsData.results.length > 0) {
            const latestPayment = paymentsData.results[0];
            const paymentResponse = await fetch(
              `https://api.mercadopago.com/v1/payments/${latestPayment.id}`,
              {
                headers: {
                  Authorization: `Bearer ${
                    process.env.MP_ACCESS_TOKEN ||
                    process.env.MERCADOPAGO_ACCESS_TOKEN
                  }`,
                },
              }
            );
            if (paymentResponse.ok) {
              paymentData = (await paymentResponse.json()) as MercadoPagoPayment;
            }
          }
        }
      }

      if (!paymentData) {
        return NextResponse.json(
          { error: "Could not fetch payment data" },
          { status: 400 }
        );
      }
    }

    if (paymentData?.status !== "approved") {
      return NextResponse.json(
        { error: "Payment is not approved", status: paymentData?.status },
        { status: 400 }
      );
    }

    const existingOrder = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("mercadopago_payment_id", paymentData.id)
      .single();

    if (existingOrder.data) {
      return NextResponse.json({
        success: true,
        message: "Order already exists",
        orderId: existingOrder.data.id,
      });
    }

    // Siempre priorizar items del frontend si están disponibles (tienen el precio correcto)
    // Solo usar items de Mercado Pago como fallback si no hay items del frontend
    const orderItems: CheckoutItemPayload[] =
      (items && items.length > 0
        ? items
        : paymentData.additional_info?.items?.map((item) =>
            mapPaymentItemToCheckout(item, paymentData as MercadoPagoPayment)
          )) || [];
    
    // Validar que los precios sean razonables (no más de 10x el total de la orden)
    // Si hay un solo item y el precio parece incorrecto, calcularlo desde el total
    if (orderItems.length === 1 && paymentData.transaction_amount > 0) {
      const item = orderItems[0];
      const calculatedPrice = paymentData.transaction_amount / item.quantity;
      const currentTotal = item.price * item.quantity;
      
      // Si el precio actual es mucho mayor que el total de la transacción, usar el calculado
      if (currentTotal > paymentData.transaction_amount * 1.1) {
        orderItems[0].price = calculatedPrice;
      }
    }

    const { data: newOrder, error: insertError } = await supabaseAdmin
      .from("orders")
      .insert({
        mercadopago_payment_id: paymentData.id,
        external_reference: externalRef || paymentData.external_reference,
        status: "approved",
        total: paymentData.transaction_amount,
        currency: paymentData.currency_id,
        items: orderItems,
        customer_email: paymentData.payer?.email,
        customer_name: paymentData.payer?.first_name
          ? `${paymentData.payer.first_name} ${paymentData.payer.last_name || ""}`.trim()
          : undefined,
        payment_data: paymentData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting order:", insertError);
      throw new Error(`Failed to insert order: ${insertError.message}`);
    }

    if (newOrder) {
      await updateStockForOrder(
        orderItems
          .filter((item) => item.productId)
          .map((item) => ({
            productId: item.productId as string,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
          }))
      );
      await sendOrderEmail({
        ...newOrder,
        mercadopago_payment_id: paymentData.id,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
    });
  } catch (error: unknown) {
    console.error("Error saving order:", error);
    const safeError =
      typeof error === "object" && error !== null ? error : null;
    const errorMessage =
      safeError && "message" in safeError && typeof safeError.message === "string"
        ? safeError.message
        : "Failed to save order";
    const errorDetails =
      process.env.NODE_ENV === "development" ? safeError : undefined;
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

