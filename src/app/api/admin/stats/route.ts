import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create admin client for stats
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function GET() {
  try {
    // Para estadísticas, usamos el cliente admin directamente
    // ya que estas son operaciones de solo lectura y no sensibles

    // Obtener estadísticas de productos
    const { data: productsData, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, precio_normal, stock, created_at");

    if (productsError) {
      // Log error in development only
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching products:", productsError);
      }
      return NextResponse.json(
        { error: "Error fetching products" },
        { status: 500 }
      );
    }

    // Obtener estadísticas de usuarios
    const { data: usersData, error: usersError } = await supabaseAdmin
      .from("profiles")
      .select("id, created_at");

    if (usersError) {
      // Log error in development only
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching users:", usersError);
      }
      return NextResponse.json(
        { error: "Error fetching users" },
        { status: 500 }
      );
    }

    // Obtener estadísticas de categorías
    const { data: categoriesData, error: categoriesError } = await supabaseAdmin
      .from("categories")
      .select("id");

    if (categoriesError) {
      // Log error in development only
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching categories:", categoriesError);
      }
    }

    // Calcular estadísticas
    const totalProducts = productsData?.length || 0;
    const totalUsers = usersData?.length || 0;
    const totalCategories = categoriesData?.length || 0;

    // Calcular productos en stock vs sin stock
    const productsInStock =
      productsData?.filter((p) => (p.stock || 0) > 0).length || 0;
    const productsOutOfStock = totalProducts - productsInStock;

    // Calcular total de unidades en stock
    const totalUnitsInStock =
      productsData?.reduce((sum, product) => sum + (product.stock || 0), 0) ||
      0;

    // Calcular valor total del inventario
    const totalInventoryValue =
      productsData?.reduce((sum, product) => {
        return sum + (product.precio_normal || 0) * (product.stock || 0);
      }, 0) || 0;

    // Calcular productos agregados este mes
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const productsThisMonth =
      productsData?.filter((product) => {
        const productDate = new Date(product.created_at);
        return productDate >= currentMonth;
      }).length || 0;

    // Calcular usuarios registrados este mes
    const usersThisMonth =
      usersData?.filter((user) => {
        const userDate = new Date(user.created_at);
        return userDate >= currentMonth;
      }).length || 0;

    // Obtener productos más populares (por stock más bajo - asumiendo que se venden más)
    const popularProducts =
      productsData
        ?.sort((a, b) => (a.stock || 0) - (b.stock || 0))
        .slice(0, 5)
        .map((product) => ({
          id: product.id,
          stock: product.stock || 0,
          price: product.precio_normal || 0,
        })) || [];

    // Obtener distribución por categorías
    const { data: categoryStats, error: categoryStatsError } =
      await supabaseAdmin
        .from("products")
        .select("categoria")
        .not("categoria", "is", null);

    const categoryDistribution: Record<string, number> = {};
    if (!categoryStatsError && categoryStats) {
      categoryStats.forEach((product) => {
        const category = product.categoria || "Sin categoría";
        categoryDistribution[category] =
          (categoryDistribution[category] || 0) + 1;
      });
    }

    const stats = {
      overview: {
        totalProducts,
        totalUsers,
        totalCategories,
        productsInStock,
        productsOutOfStock,
        totalUnitsInStock,
        totalInventoryValue,
        productsThisMonth,
        usersThisMonth,
      },
      popularProducts,
      categoryDistribution: Object.entries(categoryDistribution)
        .map(([name, count]) => ({
          name,
          count,
        }))
        .sort((a, b) => b.count - a.count),
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === "development") {
      console.error("Stats API error:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
