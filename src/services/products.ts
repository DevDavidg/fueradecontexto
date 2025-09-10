import { type PrintOption, type Product } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
type DatabaseProduct = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio_normal: number;
  precio_transferencia: number;
  metodos_pago: string[];
  envio_metodo: string;
  envio_codigo_postal: string;
  stock: number;
  created_at: string;
  updated_at: string;
};

type DatabaseColor = {
  id: string;
  product_id: string;
  nombre: string;
  hex: string;
  created_at: string;
};

type DatabaseSize = {
  id: string;
  product_id: string;
  size: string;
  created_at: string;
};

type DatabaseImage = {
  id: string;
  product_id: string;
  color: string;
  url: string;
  created_at: string;
};

type DatabasePrintSize = {
  id: string;
  product_id: string;
  size_key: string;
  price: number;
  created_at: string;
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const buildPrintOptions = (
  printSizes: DatabasePrintSize[],
  basePrice: number
): PrintOption[] => {
  const options: PrintOption[] = [];

  for (const printSize of printSizes) {
    const { size_key, price } = printSize;

    if (size_key.includes("20x30cm")) {
      options.push({
        id: "20x30",
        label: "20 x 30 cm",
        extraCost: Math.max(0, price - basePrice),
        maxWidthCm: 20,
        maxHeightCm: 30,
      });
    } else if (size_key.includes("30x40cm")) {
      options.push({
        id: "30x40",
        label: "30 x 40 cm",
        extraCost: Math.max(0, price - basePrice),
        maxWidthCm: 30,
        maxHeightCm: 40,
      });
    } else if (size_key.includes("40x50cm")) {
      options.push({
        id: "40x50",
        label: "40 x 50 cm",
        extraCost: Math.max(0, price - basePrice),
        maxWidthCm: 40,
        maxHeightCm: 50,
      });
    }
  }

  return options;
};

const transformToProduct = (
  product: DatabaseProduct,
  colors: DatabaseColor[],
  sizes: DatabaseSize[],
  images: DatabaseImage[],
  printSizes: DatabasePrintSize[]
): Product => {
  const firstImage = images[0]?.url ?? "";

  const colorOptions = colors.map((color) => ({
    name: color.nombre,
    hex: color.hex,
  }));

  const availableSizes = sizes.map((size) => size.size) as Array<
    "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Único"
  >;

  // Use stock from products table instead of product_stock table
  const productStock = product.stock || 0;

  const tags = toSlug(product.nombre).split("-").filter(Boolean);

  return {
    id: product.id,
    name: product.nombre,
    categoria: product.categoria,
    description: product.descripcion,
    price: product.precio_normal,
    currency: "ARS",
    imageUrl: firstImage,
    availableSizes,
    inStock: productStock > 0,
    stock: productStock,
    tags,
    product_images: images,
    customizable: {
      printOptions: buildPrintOptions(printSizes, product.precio_normal),
      colors: colorOptions,
    },
  };
};

type PageParams = { page: number; pageSize: number; categoria?: string };
type PageResult = {
  items: Product[];
  hasMore: boolean;
  nextPage: number | null;
};

export const productsService = {
  async updateStock(productId: string, newStock: number): Promise<boolean> {
    try {
      // Use the browser client since we're in a client-side context
      const { data, error } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", productId)
        .select("stock");

      if (error) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  async reduceStock(productId: string, quantity: number): Promise<boolean> {
    try {
      // First get current stock
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", productId)
        .single();

      if (fetchError || !product) {
        return false;
      }

      const newStock = Math.max(0, product.stock - quantity);

      const { data, error: updateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", productId)
        .select("stock");

      if (updateError) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  async getAll(categoria?: string): Promise<Product[]> {
    try {
      // Get products with optional category filter
      let query = supabase.from("products").select(`
          *,
          product_colors(*),
          product_sizes(*),
          product_images(*),
          product_print_sizes(*),
          product_stock(*)
        `);

      if (categoria) {
        query = query.eq("categoria", categoria);
      }

      const { data: products, error } = await query;

      if (error) {
        return [];
      }

      if (!products) return [];

      return products.map((product) =>
        transformToProduct(
          product,
          product.product_colors || [],
          product.product_sizes || [],
          product.product_images || [],
          product.product_print_sizes || []
        )
      );
    } catch (error) {
      return [];
    }
  },

  async getPage({
    page,
    pageSize,
    categoria,
  }: PageParams): Promise<PageResult> {
    try {
      const offset = page * pageSize;

      // Get total count for pagination
      let countQuery = supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (categoria) {
        countQuery = countQuery.eq("categoria", categoria);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        return { items: [], hasMore: false, nextPage: null };
      }

      // Get paginated products
      let query = supabase
        .from("products")
        .select(
          `
          *,
          product_colors(*),
          product_sizes(*),
          product_images(*),
          product_print_sizes(*),
          product_stock(*)
        `
        )
        .range(offset, offset + pageSize - 1);

      if (categoria) {
        query = query.eq("categoria", categoria);
      }

      const { data: products, error } = await query;

      if (error) {
        return { items: [], hasMore: false, nextPage: null };
      }

      if (!products) {
        return { items: [], hasMore: false, nextPage: null };
      }

      const items = products.map((product) =>
        transformToProduct(
          product,
          product.product_colors || [],
          product.product_sizes || [],
          product.product_images || [],
          product.product_print_sizes || []
        )
      );

      const hasMore = (count || 0) > offset + pageSize;
      const nextPage = hasMore ? page + 1 : null;

      return { items, hasMore, nextPage };
    } catch (error) {
      return { items: [], hasMore: false, nextPage: null };
    }
  },

  async getById(id: string): Promise<Product | undefined> {
    try {
      const { data: product, error } = await supabase
        .from("products")
        .select(
          `
          *,
          product_colors(*),
          product_sizes(*),
          product_images(*),
          product_print_sizes(*),
          product_stock(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        return undefined;
      }

      if (!product) return undefined;

      return transformToProduct(
        product,
        product.product_colors || [],
        product.product_sizes || [],
        product.product_images || [],
        product.product_print_sizes || []
      );
    } catch (error) {
      return undefined;
    }
  },
};
