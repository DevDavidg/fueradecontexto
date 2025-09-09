import { type PrintOption, type Product } from "@/lib/types";
import { RawProductSchema, type RawProduct } from "@/lib/schemas";
import rawProducts from "../../products.json" assert { type: "json" };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const COLOR_HEX_BY_NAME: Record<string, string> = {
  Negro: "#000000",
  Blanco: "#FFFFFF",
  Gris: "#9CA3AF",
  Azul: "#3B82F6",
  "Azul Marino": "#1E3A8A",
  Verde: "#22C55E",
  Rojo: "#EF4444",
  Amarillo: "#F59E0B",
  Natural: "#E5E7EB",
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
    console.error("products.json validation failed", parsed.error.flatten());
    return rawProducts as unknown[] as RawProduct[];
  }
  return parsed.data;
})();

const ALL_PRODUCTS: Product[] = RAW.map((item, index): Product => {
  const slug = toSlug(item.nombre);
  const id = `${slug}-${index + 1}`;
  const firstImage = item.imagenes?.[0]?.url ?? "";
  const colors = (item.colores ?? []).map((name) => ({
    name,
    hex: COLOR_HEX_BY_NAME[name] ?? "#111111",
  }));
  const totalStock = Object.values(item.stock ?? {})
    .flatMap((sizes) => Object.values(sizes))
    .reduce((acc, n) => acc + (n ?? 0), 0);
  const tags = toSlug(item.nombre).split("-").filter(Boolean);
  return {
    id,
    name: item.nombre,
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

type PageParams = { page: number; pageSize: number };
type PageResult = {
  items: Product[];
  hasMore: boolean;
  nextPage: number | null;
};

export const productsService = {
  async getAll(): Promise<Product[]> {
    await sleep(300);
    return ALL_PRODUCTS;
  },
  async getPage({ page, pageSize }: PageParams): Promise<PageResult> {
    await sleep(300);
    const start = page * pageSize;
    const end = start + pageSize;
    const items = ALL_PRODUCTS.slice(start, end);
    const hasMore = end < ALL_PRODUCTS.length;
    return { items, hasMore, nextPage: hasMore ? page + 1 : null };
  },
  async getById(id: string): Promise<Product | undefined> {
    await sleep(200);
    return ALL_PRODUCTS.find((p) => p.id === id);
  },
};
