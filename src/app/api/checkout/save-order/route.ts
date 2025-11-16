import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateStockForOrder, sendOrderEmail } from "@/lib/order-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, preferenceId, items, externalRef } = body;

    if (!paymentId && !preferenceId) {
      return NextResponse.json(
        { error: "paymentId or preferenceId is required" },
        { status: 400 }
      );
    }

    let paymentData = null;

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

      paymentData = await response.json();
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
        const preferenceData = await preferenceResponse.json();
        const paymentsResponse = await fetch(
          `https://api.mercadopago.com/v1/payments/search?preference_id=${preferenceId}&sort=date_created&criteria=desc&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
          }
        );

        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          if (paymentsData.results && paymentsData.results.length > 0) {
            const latestPayment = paymentsData.results[0];
            const paymentResponse = await fetch(
              `https://api.mercadopago.com/v1/payments/${latestPayment.id}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                },
              }
            );
            if (paymentResponse.ok) {
              paymentData = await paymentResponse.json();
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

    const orderItems = items || paymentData.additional_info?.items?.map((item: any) => ({
      productId: item.id,
      name: item.title,
      quantity: item.quantity,
      price: item.unit_price,
      currency: paymentData.currency_id,
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
      await updateStockForOrder(orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      })));
      await sendOrderEmail({
        ...newOrder,
        mercadopago_payment_id: paymentData.id,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
    });
  } catch (error: any) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to save order",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

