import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = supabaseServer;

    // First, try to fetch print sizes
    let printSizes = [];
    let printSizesError = null;

    try {
      const result = await supabase
        .from("print_sizes")
        .select("*")
        .order("price", { ascending: true });

      printSizes = result.data || [];
      printSizesError = result.error;
    } catch (error) {
      printSizesError = error;
    }

    // Try to fetch stamp options
    let stampOptions = [];
    let stampOptionsError = null;

    try {
      const result = await supabase
        .from("stamp_options")
        .select("*")
        .order("placement", { ascending: true })
        .order("size_id", { ascending: true });

      stampOptions = result.data || [];
      stampOptionsError = result.error;
    } catch (error) {
      stampOptionsError = error;
    }

    // If print_sizes table doesn't exist, return fallback data
    if (printSizesError && printSizesError.code === "PGRST205") {
      // Return fallback data with setup flag
      const fallbackPrintSizes = [
        { id: "1", size_key: "hasta_15cm", price: 0 },
        { id: "2", size_key: "hasta_20x30cm", price: 500 },
        { id: "3", size_key: "hasta_30x40cm", price: 1000 },
        { id: "4", size_key: "hasta_40x50cm", price: 1500 },
      ];

      const fallbackStampOptions = [
        // Atrás
        {
          id: "1",
          placement: "back",
          size_id: "hasta_15cm",
          label: "Atrás - Hasta 15cm",
          extra_cost: 0,
        },
        {
          id: "2",
          placement: "back",
          size_id: "hasta_20x30cm",
          label: "Atrás - Hasta 20x30cm",
          extra_cost: 500,
        },
        {
          id: "3",
          placement: "back",
          size_id: "hasta_30x40cm",
          label: "Atrás - Hasta 30x40cm",
          extra_cost: 1000,
        },
        {
          id: "4",
          placement: "back",
          size_id: "hasta_40x50cm",
          label: "Atrás - Hasta 40x50cm",
          extra_cost: 1500,
        },

        // Adelante
        {
          id: "5",
          placement: "front",
          size_id: "hasta_15cm",
          label: "Adelante - Hasta 15cm",
          extra_cost: 0,
        },
        {
          id: "6",
          placement: "front",
          size_id: "hasta_20x30cm",
          label: "Adelante - Hasta 20x30cm",
          extra_cost: 500,
        },
        {
          id: "7",
          placement: "front",
          size_id: "hasta_30x40cm",
          label: "Adelante - Hasta 30x40cm",
          extra_cost: 1000,
        },
        {
          id: "8",
          placement: "front",
          size_id: "hasta_40x50cm",
          label: "Adelante - Hasta 40x50cm",
          extra_cost: 1500,
        },

        // Adelante + Atrás
        {
          id: "9",
          placement: "front_back",
          size_id: "hasta_15cm",
          label: "Adelante + Atrás - Hasta 15cm",
          extra_cost: 0,
        },
        {
          id: "10",
          placement: "front_back",
          size_id: "hasta_20x30cm",
          label: "Adelante + Atrás - Hasta 20x30cm",
          extra_cost: 1000,
        },
        {
          id: "11",
          placement: "front_back",
          size_id: "hasta_30x40cm",
          label: "Adelante + Atrás - Hasta 30x40cm",
          extra_cost: 2000,
        },
        {
          id: "12",
          placement: "front_back",
          size_id: "hasta_40x50cm",
          label: "Adelante + Atrás - Hasta 40x50cm",
          extra_cost: 2500,
        },
      ];

      return NextResponse.json({
        success: true,
        data: {
          printSizes: fallbackPrintSizes,
          stampOptions:
            stampOptions.length > 0 ? stampOptions : fallbackStampOptions,
        },
        needsSetup: true,
        message:
          "La tabla 'print_sizes' no está configurada. Las opciones de estampas están disponibles desde la base de datos.",
      });
    }

    if (printSizesError) throw printSizesError;
    if (stampOptionsError) throw stampOptionsError;

    return NextResponse.json({
      success: true,
      data: {
        printSizes: printSizes,
        stampOptions: stampOptions,
      },
    });
  } catch (error) {
    console.error("Error fetching stamp pricing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const supabase = supabaseServer;

    // Try to insert print sizes directly
    const defaultSizes = [
      { size_key: "hasta_15cm", price: 0 },
      { size_key: "hasta_20x30cm", price: 500 },
      { size_key: "hasta_30x40cm", price: 1000 },
      { size_key: "hasta_40x50cm", price: 1500 },
    ];

    // Insert print sizes
    for (const size of defaultSizes) {
      const { error } = await supabase
        .from("print_sizes")
        .upsert(size, { onConflict: "size_key" });

      if (error) {
        console.error(`Error inserting size ${size.size_key}:`, error);
      }
    }

    // Insert stamp options
    const defaultOptions = [
      // Atrás
      {
        placement: "back",
        size_id: "hasta_15cm",
        label: "Atrás - Hasta 15cm",
        extra_cost: 0,
      },
      {
        placement: "back",
        size_id: "hasta_20x30cm",
        label: "Atrás - Hasta 20x30cm",
        extra_cost: 500,
      },
      {
        placement: "back",
        size_id: "hasta_30x40cm",
        label: "Atrás - Hasta 30x40cm",
        extra_cost: 1000,
      },
      {
        placement: "back",
        size_id: "hasta_40x50cm",
        label: "Atrás - Hasta 40x50cm",
        extra_cost: 1500,
      },

      // Adelante
      {
        placement: "front",
        size_id: "hasta_15cm",
        label: "Adelante - Hasta 15cm",
        extra_cost: 0,
      },
      {
        placement: "front",
        size_id: "hasta_20x30cm",
        label: "Adelante - Hasta 20x30cm",
        extra_cost: 500,
      },
      {
        placement: "front",
        size_id: "hasta_30x40cm",
        label: "Adelante - Hasta 30x40cm",
        extra_cost: 1000,
      },
      {
        placement: "front",
        size_id: "hasta_40x50cm",
        label: "Adelante - Hasta 40x50cm",
        extra_cost: 1500,
      },

      // Adelante + Atrás
      {
        placement: "front_back",
        size_id: "hasta_15cm",
        label: "Adelante + Atrás - Hasta 15cm",
        extra_cost: 0,
      },
      {
        placement: "front_back",
        size_id: "hasta_20x30cm",
        label: "Adelante + Atrás - Hasta 20x30cm",
        extra_cost: 1000,
      },
      {
        placement: "front_back",
        size_id: "hasta_30x40cm",
        label: "Adelante + Atrás - Hasta 30x40cm",
        extra_cost: 2000,
      },
      {
        placement: "front_back",
        size_id: "hasta_40x50cm",
        label: "Adelante + Atrás - Hasta 40x50cm",
        extra_cost: 2500,
      },
    ];

    for (const option of defaultOptions) {
      const { error } = await supabase
        .from("stamp_options")
        .upsert(option, { onConflict: "placement,size_id" });

      if (error) {
        console.error(`Error inserting option ${option.label}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sistema de precios de estampas configurado correctamente",
    });
  } catch (error) {
    console.error("Error setting up stamp pricing:", error);
    return NextResponse.json(
      { error: "Error al configurar el sistema de precios" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = supabaseServer;
    const body = await request.json();
    const { type, id, price } = body;

    if (!type || !id || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: type, id, price" },
        { status: 400 }
      );
    }

    if (price < 0 || price > 100000) {
      return NextResponse.json(
        { error: "Price must be between 0 and 100,000" },
        { status: 400 }
      );
    }

    // Check if the specific table exists for the update
    if (type === "print_size") {
      const { error: checkError } = await supabase
        .from("print_sizes")
        .select("id")
        .limit(1);
      if (checkError && checkError.code === "PGRST205") {
        return NextResponse.json({
          success: true,
          message:
            "La tabla 'print_sizes' no está configurada en la base de datos. Ejecuta el script SQL para configurar las tablas.",
          warning: true,
        });
      }
    } else if (type === "stamp_option") {
      const { error: checkError } = await supabase
        .from("stamp_options")
        .select("id")
        .limit(1);
      if (checkError && checkError.code === "PGRST205") {
        return NextResponse.json({
          success: true,
          message:
            "La tabla 'stamp_options' no está configurada en la base de datos. Ejecuta el script SQL para configurar las tablas.",
          warning: true,
        });
      }
    }

    let result;
    if (type === "print_size") {
      result = await supabase
        .from("print_sizes")
        .update({ price })
        .eq("id", id);
    } else if (type === "stamp_option") {
      result = await supabase
        .from("stamp_options")
        .update({ extra_cost: price })
        .eq("id", id);
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'print_size' or 'stamp_option'" },
        { status: 400 }
      );
    }

    if (result.error) throw result.error;

    return NextResponse.json({
      success: true,
      message: "Price updated successfully",
    });
  } catch (error) {
    console.error("Error updating stamp pricing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
