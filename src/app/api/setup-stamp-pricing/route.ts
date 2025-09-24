import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    // Intentar obtener datos de print_sizes para verificar si existe
    let printSizesExist = false;
    try {
      const { data, error } = await supabase
        .from("print_sizes")
        .select("id")
        .limit(1);

      if (!error) {
        printSizesExist = true;
      }
    } catch (e) {
      printSizesExist = false;
    }

    // Intentar obtener datos de stamp_options para verificar si existe
    let stampOptionsExist = false;
    try {
      const { data, error } = await supabase
        .from("stamp_options")
        .select("id")
        .limit(1);

      if (!error) {
        stampOptionsExist = true;
      }
    } catch (e) {
      stampOptionsExist = false;
    }

    // Si las tablas no existen, solo insertar datos en las que sí existen
    if (printSizesExist) {
      const { data: existingSizes, error: sizesError } = await supabase
        .from("print_sizes")
        .select("size_key");

      if (!sizesError) {
        const existingSizeKeys = existingSizes?.map((s) => s.size_key) || [];
        const defaultSizes = [
          { size_key: "hasta_15cm", price: 0 },
          { size_key: "hasta_20x30cm", price: 500 },
          { size_key: "hasta_30x40cm", price: 1000 },
          { size_key: "hasta_40x50cm", price: 1500 },
        ];

        for (const size of defaultSizes) {
          if (!existingSizeKeys.includes(size.size_key)) {
            const { error: insertError } = await supabase
              .from("print_sizes")
              .insert(size);

            if (insertError) {
              console.error(
                `Error inserting size ${size.size_key}:`,
                insertError
              );
            }
          }
        }
      }
    }

    // Si las tablas existen, insertar datos
    if (stampOptionsExist) {
      const { data: existingOptions, error: optionsError } = await supabase
        .from("stamp_options")
        .select("id");

      if (!optionsError && (!existingOptions || existingOptions.length === 0)) {
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
          const { error: insertError } = await supabase
            .from("stamp_options")
            .insert(option);

          if (insertError) {
            console.error(
              `Error inserting option ${option.label}:`,
              insertError
            );
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Stamp pricing tables setup completed successfully",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
