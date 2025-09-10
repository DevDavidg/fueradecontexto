import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import rawProducts from "../../../../products.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Verify admin access (you can add your own auth logic here)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear existing data (optional - remove if you want to keep existing data)
    await supabase
      .from("product_stock")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("product_print_sizes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("product_images")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("product_sizes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("product_colors")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("products").delete().neq("id", "");
    await supabase.from("categories").delete().neq("id", "");

    // Insert categories first
    const categories = [
      { id: "buzos", name: "Buzos", description: "Buzos y hoodies premium" },
      { id: "camperas", name: "Camperas", description: "Camperas y abrigos" },
      {
        id: "gorras",
        name: "Gorras",
        description: "Gorras y accesorios para la cabeza",
      },
      { id: "totebags", name: "Tote Bags", description: "Bolsos y accesorios" },
    ];

    const { error: categoriesError } = await supabase
      .from("categories")
      .insert(categories);

    if (categoriesError) {
      return NextResponse.json(
        { error: "Failed to insert categories" },
        { status: 500 }
      );
    }

    // Process each product
    for (const product of rawProducts) {
      // Insert main product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert({
          id: product.id,
          nombre: product.nombre,
          categoria: product.categoria,
          descripcion: product.descripcion,
          precio_normal: product.precio.normal,
          precio_transferencia: product.precio.transferencia,
          metodos_pago: product.metodos_pago,
          envio_metodo: product.envio.metodo,
          envio_codigo_postal: product.envio.codigo_postal,
        })
        .select()
        .single();

      if (productError) {
        continue;
      }

      // Insert colors
      if (product.colores && product.colores.length > 0) {
        const colors = product.colores.map((color: any) => ({
          product_id: product.id,
          nombre: color.nombre,
          hex: color.hex,
        }));

        const { error: colorsError } = await supabase
          .from("product_colors")
          .insert(colors);

        if (colorsError) {
          // Error inserting colors
        }
      }

      // Insert sizes
      if (product.talles && product.talles.length > 0) {
        const sizes = product.talles.map((size: string) => ({
          product_id: product.id,
          size: size,
        }));

        const { error: sizesError } = await supabase
          .from("product_sizes")
          .insert(sizes);

        if (sizesError) {
          // Error inserting sizes
        }
      }

      // Insert images
      if (product.imagenes && product.imagenes.length > 0) {
        const images = product.imagenes.map((image: any) => ({
          product_id: product.id,
          color: image.color,
          url: image.url,
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(images);

        if (imagesError) {
          // Error inserting images
        }
      }

      // Insert print sizes
      if (product.tamaño_estampa) {
        const printSizes = Object.entries(product.tamaño_estampa).map(
          ([key, price]) => ({
            product_id: product.id,
            size_key: key,
            price: price as number,
          })
        );

        const { error: printSizesError } = await supabase
          .from("product_print_sizes")
          .insert(printSizes);

        if (printSizesError) {
          // Error inserting print sizes
        }
      }

      // Insert stock
      if (product.stock) {
        const stockEntries = [];
        for (const [color, sizes] of Object.entries(product.stock)) {
          for (const [size, quantity] of Object.entries(sizes as any)) {
            stockEntries.push({
              product_id: product.id,
              color: color,
              size: size,
              quantity: quantity as number,
            });
          }
        }

        if (stockEntries.length > 0) {
          const { error: stockError } = await supabase
            .from("product_stock")
            .insert(stockEntries);

          if (stockError) {
            // Error inserting stock
          }
        }
      }
    }

    return NextResponse.json({
      message: "Products seeded successfully",
      count: rawProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
