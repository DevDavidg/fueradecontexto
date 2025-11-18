import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import type {
  CheckoutItemPayload,
  CreatePreferencePayload,
  PreferencePayload,
} from "@/types/checkout";

const accessToken =
  process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MP_ACCESS_TOKEN or MERCADOPAGO_ACCESS_TOKEN environment variable is required");
}

const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  },
});

const preference = new Preference(client);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePreferencePayload;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    const configuredBaseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      null;

    const host = request.headers.get("host") || "localhost:3000";
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const protocol =
      configuredBaseUrl?.startsWith("https://") ||
      forwardedProto === "https" ||
      (!forwardedProto && !host.includes("localhost"))
        ? "https"
        : "http";

    const baseUrl = (
      configuredBaseUrl?.replace(/\/$/, "") || `${protocol}://${host}`
    ).replace(/\/$/, "");
    
    const items = body.items.map((item: CheckoutItemPayload) => {
      const sizeText = item.selectedSize ? `Talle ${item.selectedSize}` : "";
      const customizationText = item.customization 
        ? `· Estampa ${item.customization.printSizeId} · ${item.customization.colorName}` 
        : "";
      const description = `${sizeText} ${customizationText}`.trim();
      
      const unitPrice = Number(item.price) + (Number(item.customization?.extraCost) || 0);
      
      if (unitPrice <= 0) {
        throw new Error(`Invalid price for item ${item.name || item.productId}`);
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Invalid quantity for item ${item.name || item.productId}`);
      }

      return {
        id: String(item.productId || Math.random().toString(36).substring(7)),
        title: String(item.name || "Producto").substring(0, 127),
        description: description || undefined,
        quantity: Number(item.quantity),
        currency_id: "ARS",
        unit_price: Number(unitPrice.toFixed(2)),
        picture_url: item.imageUrl || undefined,
      };
    });

    const externalRef = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const successUrl = `${baseUrl}/checkout/success`.replace(/\/+/g, '/').replace(':/', '://');
    const failureUrl = `${baseUrl}/checkout/failure`.replace(/\/+/g, '/').replace(':/', '://');
    const pendingUrl = `${baseUrl}/checkout/pending`.replace(/\/+/g, '/').replace(':/', '://');
    
    if (!successUrl || !failureUrl || !pendingUrl) {
      throw new Error("Failed to build back URLs");
    }

    const isValidUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    };

    if (!isValidUrl(successUrl) || !isValidUrl(failureUrl) || !isValidUrl(pendingUrl)) {
      throw new Error("Invalid URL format for back URLs");
    }
    
    const preferenceData: PreferencePayload = {
      items,
      external_reference: externalRef,
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
    };

    const isHttps = baseUrl.startsWith("https");
    
    if (isHttps && successUrl) {
      preferenceData.auto_return = "approved";
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Preference data:", JSON.stringify(preferenceData, null, 2));
      console.log("Base URL:", baseUrl);
      console.log("Is HTTPS:", isHttps);
      console.log("Success URL:", successUrl);
      console.log("Failure URL:", failureUrl);
      console.log("Pending URL:", pendingUrl);
      console.log("Has auto_return:", preferenceData.auto_return);
    }

    const response = await preference.create({ 
      body: preferenceData,
      requestOptions: {
        idempotencyKey: externalRef,
      },
    });

    if (!response.init_point) {
      throw new Error("Mercado Pago did not return a payment URL");
    }

    return NextResponse.json({ 
      initPoint: response.init_point, 
      preferenceId: response.id 
    });
  } catch (error: unknown) {
    console.error("Error creating preference:", error);

    const safeError =
      typeof error === "object" && error !== null ? error : null;

    const errorMessage =
      safeError && "message" in safeError && typeof safeError.message === "string"
        ? safeError.message
        : "Failed to create preference";

    const errorDetails =
      process.env.NODE_ENV === "development" ? safeError : undefined;

    const status =
      safeError && "status" in safeError && typeof safeError.status === "number"
        ? safeError.status
        : 500;

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
      },
      { status }
    );
  }
}

