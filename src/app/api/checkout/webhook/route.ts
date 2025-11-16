import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateStockForOrder, sendOrderEmail } from "@/lib/order-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.type === "payment") {
      const { data: payment } = await fetch(
        `https://api.mercadopago.com/v1/payments/${body.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      ).then((res) => res.json());

      if (payment.status === "approved") {
        const { external_reference } = payment;
        
        const items = payment.additional_info?.items?.map((item: any) => ({
          productId: item.id,
          name: item.title,
          quantity: item.quantity,
          price: item.unit_price,
          currency: payment.currency_id,
          selectedSize: item.description?.match(/Talle (\w+)/)?.[1],
          customization: item.description?.includes("Estampa")
            ? {
                printSizeId: item.description?.match(/Estampa (\w+)/)?.[1] || "",
                colorName:
                  item.description?.match(/· (\w+)$/)?.[1] || "Estándar",
                extraCost: 0,
              }
            : undefined,
        })) || [];

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
          await updateStockForOrder(items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
          })));
          await sendOrderEmail({
            ...newOrder,
            mercadopago_payment_id: payment.id,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook failed" },
      { status: 500 }
    );
  }
}

