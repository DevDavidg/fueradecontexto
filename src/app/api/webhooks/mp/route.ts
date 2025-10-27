import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Configuración del cliente de Mercado Pago
const initMercadoPago = () => {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      "MP_ACCESS_TOKEN no está configurado en las variables de entorno"
    );
  }

  return new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 5000,
    },
  });
};

/**
 * POST /api/webhooks/mp
 * Webhook para recibir notificaciones de cambios de estado de pagos desde Mercado Pago
 *
 * Configura esta URL en tu panel de Mercado Pago:
 * https://www.mercadopago.com.ar/developers/panel/app
 */
export async function POST(req: NextRequest) {
  try {
    // Obtener el tipo de notificación de los query params
    const topic =
      req.nextUrl.searchParams.get("type") ||
      req.nextUrl.searchParams.get("topic");

    // Parsear el body
    const body = await req.json();

    console.log("Webhook de Mercado Pago recibido:", {
      topic,
      body,
      timestamp: new Date().toISOString(),
    });

    // Si es una notificación de pago
    if (topic === "payment") {
      const paymentId = body.data?.id;

      if (!paymentId) {
        console.error("Webhook sin ID de pago");
        return NextResponse.json(
          { message: "ID de pago no proporcionado" },
          { status: 400 }
        );
      }

      // Obtener información completa del pago
      const client = initMercadoPago();
      const payment = new Payment(client);

      const paymentInfo = await payment.get({ id: paymentId });

      console.log("Información del pago:", {
        id: paymentInfo.id,
        status: paymentInfo.status,
        status_detail: paymentInfo.status_detail,
        external_reference: paymentInfo.external_reference,
        transaction_amount: paymentInfo.transaction_amount,
        payment_method_id: paymentInfo.payment_method_id,
      });

      // Aquí deberías actualizar el estado de la orden en tu base de datos
      // Por ejemplo:
      // - Si status === "approved": marcar orden como pagada
      // - Si status === "rejected": marcar orden como rechazada
      // - Si status === "in_process": marcar orden como pendiente
      // - Si status === "refunded": marcar orden como reembolsada

      // TODO: Implementar lógica de actualización de orden
      await handlePaymentStatusUpdate(paymentInfo);
    }

    // Responder con 200 para confirmar recepción
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error procesando webhook de Mercado Pago:", error);

    // Es importante devolver 200 incluso en errores para evitar reintento
    // de webhooks en algunos casos
    return NextResponse.json(
      {
        received: true,
        error: "Error interno procesando webhook",
      },
      { status: 200 }
    );
  }
}

/**
 * Maneja la actualización del estado de la orden según el estado del pago
 * Esta función debe adaptarse a tu lógica de negocio y base de datos
 */
async function handlePaymentStatusUpdate(paymentInfo: any) {
  const orderId = paymentInfo.external_reference;
  const status = paymentInfo.status;
  const statusDetail = paymentInfo.status_detail;

  console.log(
    `Actualizando orden ${orderId} con estado de pago: ${status} (${statusDetail})`
  );

  // TODO: Implementar la lógica de actualización según tu caso de uso
  // Ejemplo con Supabase:
  /*
  const { createClient } = await import('@/lib/supabase-server');
  const supabase = createClient();
  
  await supabase
    .from('orders')
    .update({
      payment_status: status,
      payment_id: paymentInfo.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);
  */

  switch (status) {
    case "approved":
      console.log(`✅ Pago aprobado para orden ${orderId}`);
      // Aquí podrías:
      // - Marcar la orden como pagada
      // - Enviar email de confirmación
      // - Iniciar proceso de fulfillment
      break;

    case "in_process":
      console.log(`⏳ Pago en proceso para orden ${orderId}`);
      // El pago está siendo revisado
      // Puede ser por revisión manual o proceso bancario
      break;

    case "rejected":
      console.log(`❌ Pago rechazado para orden ${orderId}`);
      // El pago fue rechazado
      // Puedes notificar al usuario para que intente con otro método
      break;

    case "cancelled":
      console.log(`🚫 Pago cancelado para orden ${orderId}`);
      // El pago fue cancelado
      break;

    case "refunded":
      console.log(`💰 Pago reembolsado para orden ${orderId}`);
      // Se hizo un reembolso
      // Actualizar stock, notificar al usuario, etc.
      break;

    case "charged_back":
      console.log(`⚠️ Contracargo para orden ${orderId}`);
      // Se inició un contracargo/disputa
      break;

    default:
      console.log(`❓ Estado desconocido: ${status} para orden ${orderId}`);
  }
}

/**
 * GET /api/webhooks/mp
 * Endpoint de verificación (opcional)
 */
export async function GET() {
  return NextResponse.json({
    message: "Webhook de Mercado Pago funcionando",
    timestamp: new Date().toISOString(),
  });
}
