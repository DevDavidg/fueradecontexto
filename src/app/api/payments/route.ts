import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import type { MercadoPagoPaymentRequest } from "@/lib/types";

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
      idempotencyKey: "random-key", // se sobrescribe por request
    },
  });
};

/**
 * POST /api/payments
 * Crea un pago en Mercado Pago usando el token de tarjeta generado en el cliente
 */
export async function POST(req: NextRequest) {
  try {
    // Obtener la clave de idempotencia de los headers
    const idempotencyKey = req.headers.get("x-idempotency-key") ?? undefined;

    // Parsear el body
    const body: MercadoPagoPaymentRequest = await req.json();
    const { amount, orderId, paymentData } = body;

    // Validaciones
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "El monto debe ser mayor a 0" },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { message: "El ID de orden es requerido" },
        { status: 400 }
      );
    }

    if (!paymentData?.token) {
      return NextResponse.json(
        { message: "El token de pago es requerido" },
        { status: 400 }
      );
    }

    // Inicializar cliente de Mercado Pago
    const client = initMercadoPago();
    const payment = new Payment(client);

    // Preparar el payload del pago
    const paymentPayload = {
      transaction_amount: Number(amount),
      token: paymentData.token,
      description: `Orden #${orderId} - Fueradecontexto`,
      installments: paymentData.installments ?? 1,
      payment_method_id: paymentData.payment_method_id,
      issuer_id: Number(paymentData.issuer_id),
      payer: {
        email: paymentData.payer?.email || "customer@example.com",
        identification: paymentData.payer?.identification
          ? {
              type: paymentData.payer.identification.type,
              number: paymentData.payer.identification.number,
            }
          : undefined,
      },
      external_reference: orderId,
      statement_descriptor: "FUERADECONTEXTO",
      // Opcional: configurar URL de notificación si no tienes webhook global
      // notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mp`,
    };

    // Crear el pago
    const response = await payment.create({
      body: paymentPayload,
      requestOptions: {
        idempotencyKey,
      },
    });

    // Log para debugging (en producción considera usar un logger apropiado)
    console.log("Pago creado:", {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
      external_reference: response.external_reference,
    });

    // Retornar respuesta exitosa
    return NextResponse.json(
      {
        id: response.id,
        status: response.status,
        status_detail: response.status_detail,
        transaction_amount: response.transaction_amount,
        payment_method_id: response.payment_method_id,
        installments: response.installments,
        external_reference: response.external_reference,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Log detallado del error
    console.error("Error al crear el pago:", {
      message: error?.message,
      cause: error?.cause,
      status: error?.status,
    });

    // Manejar errores específicos de Mercado Pago
    if (error?.status === 400) {
      return NextResponse.json(
        {
          message:
            "Error de validación. Verifica los datos de pago e intenta nuevamente.",
          details: error?.message,
        },
        { status: 400 }
      );
    }

    if (error?.status === 401) {
      return NextResponse.json(
        {
          message:
            "Error de autenticación con Mercado Pago. Contacta al administrador.",
        },
        { status: 500 }
      );
    }

    if (error?.status === 404) {
      return NextResponse.json(
        {
          message: "Método de pago no encontrado.",
        },
        { status: 400 }
      );
    }

    // Error genérico
    return NextResponse.json(
      {
        message:
          error?.message ||
          "Error al procesar el pago. Por favor, intenta nuevamente.",
      },
      { status: 500 }
    );
  }
}
