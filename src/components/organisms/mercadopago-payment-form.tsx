"use client";

import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect, useMemo, useState } from "react";
import type { MercadoPagoPaymentRequest } from "@/lib/types";

type PaymentFormProps = {
  amount: number;
  orderId: string;
  email?: string;
  onSuccess?: (paymentId: number) => void;
  onError?: (error: Error) => void;
};

/**
 * Componente organismo para procesar pagos con Mercado Pago
 * Utiliza el Payment Brick para captura segura de datos de tarjeta
 */
export const MercadoPagoPaymentForm = ({
  amount,
  orderId,
  email,
  onSuccess,
  onError,
}: PaymentFormProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inicializa el SDK de Mercado Pago con la Public Key
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

    console.log("🔑 Inicializando Mercado Pago...");
    console.log("Public Key presente:", publicKey ? "✅ Sí" : "❌ No");
    console.log("Monto:", amount);
    console.log("Email:", email || "sin email");

    if (!publicKey) {
      console.error(
        "❌ NEXT_PUBLIC_MP_PUBLIC_KEY no está configurada. Verifica tu archivo .env.local"
      );
      const error = new Error(
        "Credenciales de Mercado Pago no configuradas. Contacta al administrador."
      );
      onError?.(error);
      return;
    }

    if (!amount || amount <= 0) {
      console.error("❌ El monto debe ser mayor a 0");
      const error = new Error("El monto de la compra no es válido");
      onError?.(error);
      return;
    }

    try {
      initMercadoPago(publicKey, {
        locale: "es-AR",
      });
      console.log("✅ Mercado Pago inicializado correctamente");
      setIsInitialized(true);
    } catch (error) {
      console.error("❌ Error al inicializar Mercado Pago:", error);
      onError?.(
        new Error("Error al inicializar el sistema de pagos. Intenta de nuevo.")
      );
    }
  }, [onError, amount, email]);

  // Configuración de inicialización del Payment Brick
  const initialization = useMemo(
    () => ({
      amount: Number(amount),
      payer: {
        email: email || "test@test.com",
        entityType: "individual" as const, // Tipo de entidad: individual o association
      },
    }),
    [amount, email]
  );

  // Configuración de personalización del Payment Brick
  const customization = useMemo(
    () => ({
      visual: {
        style: {
          theme: "dark" as const,
        },
      },
      paymentMethods: {
        creditCard: "all" as const,
        debitCard: "all" as const,
        maxInstallments: 12,
      },
    }),
    []
  );

  // Maneja el envío del formulario
  async function onSubmit(formData: any) {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const payload: MercadoPagoPaymentRequest = {
        amount,
        orderId,
        paymentData: formData.formData,
        paymentMethod: formData.selectedPaymentMethod,
      };

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": orderId,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Error al procesar el pago. Intenta nuevamente."
        );
      }

      // Pago exitoso
      onSuccess?.(data.id);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al procesar el pago. Por favor, intenta de nuevo.";

      console.error("Error en el pago:", error);
      onError?.(new Error(errorMessage));
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }

  // Maneja errores del Brick
  function handleError(error: unknown) {
    console.error("❌ Error del Payment Brick:", error);
    console.error("Tipo de error:", typeof error);
    console.error("Error completo:", JSON.stringify(error, null, 2));

    let errorMessage = "Ocurrió un error con el formulario de pago";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      // Si es un objeto, intentar extraer el mensaje
      const errorObj = error as any;
      errorMessage =
        errorObj.message || errorObj.error || errorObj.cause || errorMessage;
    }

    console.error("Mensaje de error final:", errorMessage);
    onError?.(new Error(errorMessage));
  }

  // Callback cuando el Brick está listo
  function handleReady() {
    console.log("Payment Brick listo");
  }

  // No renderizar nada hasta que esté inicializado
  if (!isInitialized) {
    return (
      <div className="w-full max-w-2xl rounded-lg border border-[#333333] bg-black p-6">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C2187A] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-lg border border-[#333333] bg-black p-6">
      <h2 className="mb-4 text-xl font-semibold text-[#ededed]">
        Información de Pago
      </h2>
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={handleReady}
        onError={handleError}
      />
      {isProcessing && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#C2187A] border-t-transparent"></div>
          <span>Procesando pago...</span>
        </div>
      )}
    </div>
  );
};
