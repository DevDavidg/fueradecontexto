import { NextRequest, NextResponse } from "next/server";
import { productsService } from "@/services/products";

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid productId or quantity" },
        { status: 400 }
      );
    }

    const success = await productsService.reduceStock(productId, quantity);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to reduce stock" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
