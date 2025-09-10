import { type PrintOption, type Product } from "@/lib/types";
import { RawProductSchema, type RawProduct } from "@/lib/schemas";
import rawProducts from "../../products.json" assert { type: "json" };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const COLOR_HEX_BY_NAME: Record<string, string> = {
  Negro: "#000000",
  Blanco: "#FFFFFF",
  Gris: "#808080",
  Azul: "#2563EB",
  "Azul Francia": "#0072BB",
  "Azul Marino": "#1E3A8A",
  Verde: "#22C55E",
  "Verde Botella": "#166534",
  "Verde Lima": "#84CC16",
  "Verde Militar Blanca": "#166534",
  Rojo: "#DC2626",
  Rosa: "#EC4899",
  Amarillo: "#F59E0B",
  Bordo: "#7C2D12",
  Violeta: "#7C3AED",
  "Violeta Blanca": "#7C3AED",
  Marrón: "#8B4513",
  Natural: "#F5F5DC",
  // Special trucker colors
  "Negro Blanca": "#000000",
  "Gris Blanco": "#808080",
  "Azul Roja Blanca": "#2563EB",
  "Azul Beige Roja": "#2563EB",
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const buildPrintOptions = (raw: RawProduct): PrintOption[] => {
  const base = raw.precio.normal;
  const entries = Object.entries(raw.tamaño_estampa);
  const get = (k: string) => entries.find(([key]) => key.includes(k))?.[1];
  const p20 = get("20x30cm");
  const p30 = get("30x40cm");
  const p40 = get("40x50cm");
  const options: PrintOption[] = [];
  if (typeof p20 === "number") {
    options.push({
      id: "20x30",
      label: "20 x 30 cm",
      extraCost: Math.max(0, p20 - base),
      maxWidthCm: 20,
      maxHeightCm: 30,
    });
  }
  if (typeof p30 === "number") {
    options.push({
      id: "30x40",
      label: "30 x 40 cm",
      extraCost: Math.max(0, p30 - base),
      maxWidthCm: 30,
      maxHeightCm: 40,
    });
  }
  if (typeof p40 === "number") {
    options.push({
      id: "40x50",
      label: "40 x 50 cm",
      extraCost: Math.max(0, p40 - base),
      maxWidthCm: 40,
      maxHeightCm: 50,
    });
  }
  return options;
};

const RAW: RawProduct[] = (() => {
  const parsed = RawProductSchema.array().safeParse(rawProducts);
  if (!parsed.success) {
    console.error("products.json validation failed", parsed.error.issues);
    return rawProducts as unknown[] as RawProduct[];
  }
  return parsed.data;
})();

const ALL_PRODUCTS: Product[] = RAW.map((item, index): Product => {
  const slug = toSlug(item.nombre);
  const id = `${slug}-${index + 1}`;
  const firstImage = item.imagenes?.[0]?.url ?? "";

  // Handle both old string array and new object array for colors
  const colors = Array.isArray(item.colores)
    ? item.colores.map((color) => {
        if (typeof color === "string") {
          return {
            name: color,
            hex: COLOR_HEX_BY_NAME[color] ?? "#111111",
          };
        }
        // Map Spanish property names to English
        return {
          name: color.nombre,
          hex: color.hex,
        };
      })
    : [];

  const totalStock = Object.values(item.stock ?? {})
    .flatMap((sizes) => Object.values(sizes))
    .reduce((acc, n) => acc + (n ?? 0), 0);
  const tags = toSlug(item.nombre).split("-").filter(Boolean);
  return {
    id,
    name: item.nombre,
    categoria: item.categoria ?? "general",
    description: item.descripcion,
    price: item.precio.normal,
    currency: "ARS",
    imageUrl: firstImage,
    availableSizes: item.talles,
    inStock: totalStock > 0,
    tags,
    customizable: {
      printOptions: buildPrintOptions(item),
      colors,
    },
  };
});

type PageParams = { page: number; pageSize: number; categoria?: string };
type PageResult = {
  items: Product[];
  hasMore: boolean;
  nextPage: number | null;
};

export const productsService = {
  async getAll(categoria?: string): Promise<Product[]> {
    await sleep(300);
    if (categoria) {
      return ALL_PRODUCTS.filter((p) => p.categoria === categoria);
    }
    return ALL_PRODUCTS;
  },
  async getPage({
    page,
    pageSize,
    categoria,
  }: PageParams): Promise<PageResult> {
    await sleep(300);
    let filteredProducts = ALL_PRODUCTS;
    if (categoria) {
      filteredProducts = ALL_PRODUCTS.filter((p) => p.categoria === categoria);
    }
    const start = page * pageSize;
    const end = start + pageSize;
    const items = filteredProducts.slice(start, end);
    const hasMore = end < filteredProducts.length;
    return { items, hasMore, nextPage: hasMore ? page + 1 : null };
  },
  async getById(id: string): Promise<Product | undefined> {
    await sleep(200);
    return ALL_PRODUCTS.find((p) => p.id === id);
  },
};
