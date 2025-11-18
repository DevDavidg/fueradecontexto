import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateStockForOrder, sendOrderEmail } from "@/lib/order-utils";
import type {
  CheckoutItemPayload,
  MercadoPagoPayment,
  MercadoPagoPaymentItem,
} from "@/types/checkout";

const mapPaymentItemToCheckout = (
  item: MercadoPagoPaymentItem,
  payment: MercadoPagoPayment
): CheckoutItemPayload => {
  const selectedSize = item.description?.match(/Talle (\w+)/)?.[1];
  const customizationMatch = item.description?.match(/Estampa (\w+)/)?.[1];
  const colorMatch = item.description?.match(/· (\w+)$/)?.[1];

  return {
    productId: item.id,
    name: item.title,
    quantity: item.quantity,
    price: item.unit_price,
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
    const body = await request.json();
    
    if (body.type === "payment") {
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${body.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${
              process.env.MP_ACCESS_TOKEN ||
              process.env.MERCADOPAGO_ACCESS_TOKEN
            }`,
          },
        }
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to fetch payment for webhook");
      }

      const payment = (await paymentResponse.json()) as MercadoPagoPayment;

      if (payment.status === "approved") {
        const { external_reference } = payment;
        
        const items: CheckoutItemPayload[] =
          payment.additional_info?.items?.map((item) =>
            mapPaymentItemToCheckout(item, payment)
          ) || [];

        const { data: newOrder, error: insertError } = await supabaseAdmin.from("orders").insert({
          mercadopago_payment_id: payment.id,
          external_reference,
          status: "approved",
          total: payment.transaction_amount,
          currency: payment.currency_id,
          items,
          customer_email: payment.payer?.email,
          customer_name: payment.payer?.first_name
            ? `${payment.payer.first_name} ${payment.payer.last_name || ""}`.trim()
            : undefined,
          payment_data: payment,
          created_at: new Date().toISOString(),
        }).select().single();

        if (insertError) {
          console.error("Error inserting order:", insertError);
          throw new Error(`Failed to insert order: ${insertError.message}`);
        }

        if (newOrder) {
          await updateStockForOrder(
            items
              .filter((item) => item.productId)
              .map((item) => ({
                productId: item.productId as string,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
              }))
          );
          await sendOrderEmail({
            ...newOrder,
            mercadopago_payment_id: payment.id,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const safeError =
      typeof error === "object" && error !== null ? error : null;
    return NextResponse.json(
      {
        error:
          safeError &&
          "message" in safeError &&
          typeof safeError.message === "string"
            ? safeError.message
            : "Webhook failed",
      },
      { status: 500 }
    );
  }
}

