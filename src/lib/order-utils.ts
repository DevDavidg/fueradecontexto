import { supabaseAdmin } from "./supabase-admin";

export async function updateStockForOrder(items: Array<{
  productId: string;
  quantity: number;
  selectedSize?: string;
}>) {
  try {
    for (const item of items) {
      const { data: product, error: fetchError } = await supabaseAdmin
        .from("products")
        .select("stock")
        .eq("id", item.productId)
        .single();

      if (fetchError || !product) {
        console.error(`Error fetching product ${item.productId}:`, fetchError);
        continue;
      }

      const currentStock = product.stock || 0;
      const newStock = Math.max(0, currentStock - item.quantity);

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.productId);

      if (updateError) {
        console.error(`Error updating stock for product ${item.productId}:`, updateError);
      } else {
        console.log(`Stock updated for product ${item.productId}: ${currentStock} -> ${newStock}`);
      }
    }

    return true;
  } catch (error) {
    console.error("Error updating stock:", error);
    return false;
  }
}

export function formatOrderEmail(order: {
  id: string;
  external_reference: string;
  status: string;
  total: number;
  currency: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    customization?: {
      printSizeId: string;
      colorName: string;
      extraCost: number;
    };
  }>;
  customer_email?: string;
  customer_name?: string;
  mercadopago_payment_id: string | number;
  created_at: string;
}) {
  const itemsHtml = order.items.map(item => {
    const sizeText = item.selectedSize ? ` - Talle: ${item.selectedSize}` : "";
    const customizationText = item.customization 
      ? ` - Estampa: ${item.customization.printSizeId} - Color: ${item.customization.colorName}` 
      : "";
    const itemTotal = (item.price + (item.customization?.extraCost || 0)) * item.quantity;
    
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}${sizeText}${customizationText}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Nueva Orden - ${order.external_reference}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #C2187A;">Nueva Orden de Compra</h2>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p><strong>ID de Orden:</strong> ${order.external_reference}</p>
          <p><strong>Estado:</strong> ${order.status}</p>
          <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleString("es-AR")}</p>
          <p><strong>ID de Pago Mercado Pago:</strong> ${order.mercadopago_payment_id}</p>
        </div>

        <h3 style="color: #C2187A; border-bottom: 2px solid #C2187A; padding-bottom: 5px;">Información del Cliente</h3>
        <div style="margin-bottom: 20px;">
          <p><strong>Nombre:</strong> ${order.customer_name || "No especificado"}</p>
          <p><strong>Email:</strong> ${order.customer_email || "No especificado"}</p>
        </div>

        <h3 style="color: #C2187A; border-bottom: 2px solid #C2187A; padding-bottom: 5px;">Productos</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #C2187A; color: white;">
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: center;">Cantidad</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #C2187A; color: white; padding: 15px; border-radius: 5px; text-align: right;">
          <p style="margin: 0; font-size: 20px; font-weight: bold;">
            Total: ${order.currency} $${order.total.toFixed(2)}
          </p>
        </div>

        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          Esta es una notificación automática del sistema de pedidos.
        </p>
      </body>
    </html>
  `;

  const text = `
Nueva Orden de Compra

ID de Orden: ${order.external_reference}
Estado: ${order.status}
Fecha: ${new Date(order.created_at).toLocaleString("es-AR")}
ID de Pago Mercado Pago: ${order.mercadopago_payment_id}

Información del Cliente:
- Nombre: ${order.customer_name || "No especificado"}
- Email: ${order.customer_email || "No especificado"}

Productos:
${order.items.map(item => {
  const sizeText = item.selectedSize ? ` - Talle: ${item.selectedSize}` : "";
  const customizationText = item.customization 
    ? ` - Estampa: ${item.customization.printSizeId} - Color: ${item.customization.colorName}` 
    : "";
  const itemTotal = (item.price + (item.customization?.extraCost || 0)) * item.quantity;
  return `- ${item.name}${sizeText}${customizationText} (Cantidad: ${item.quantity}) - Total: $${itemTotal.toFixed(2)}`;
}).join("\n")}

Total: ${order.currency} $${order.total.toFixed(2)}
  `;

  return { html, text };
}

export async function sendOrderEmail(order: {
  id: string;
  external_reference: string;
  status: string;
  total: number;
  currency: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    selectedSize?: string;
    customization?: {
      printSizeId: string;
      colorName: string;
      extraCost: number;
    };
  }>;
  customer_email?: string;
  customer_name?: string;
  mercadopago_payment_id: string | number;
  created_at: string;
}) {
  try {
    const { html, text } = formatOrderEmail(order);
    const toEmail = "fueradecontexto04@gmail.com";

    if (process.env.RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "noreply@fueradecontexto.com",
          to: toEmail,
          subject: `Nueva Orden - ${order.external_reference}`,
          html,
          text,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Resend API error: ${JSON.stringify(error)}`);
      }

      return true;
    } else {
      console.log("Email would be sent to:", toEmail);
      console.log("Subject: Nueva Orden -", order.external_reference);
      console.log("HTML:", html);
      
      return false;
    }
  } catch (error) {
    console.error("Error sending order email:", error);
    return false;
  }
}

