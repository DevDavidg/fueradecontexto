import { type Product } from "@/lib/types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BASE_PRODUCTS: Product[] = [
  {
    id: "tee-black",
    name: "Fueradecontexto Tee – Black",
    description: "Soft cotton tee with minimal branding.",
    price: 29,
    currency: "USD",
    imageUrl: "",
    availableSizes: ["S", "M", "L", "XL"],
    inStock: true,
    tags: ["tee", "black", "cotton"],
  },
  {
    id: "hoodie-grey",
    name: "Fueradecontexto Hoodie – Grey",
    description:
      "Cozy fleece hoodie. Regular fit. Personalizable con estampas.",
    price: 69,
    currency: "USD",
    imageUrl: "",
    availableSizes: ["M", "L", "XL"],
    inStock: true,
    tags: ["hoodie", "grey", "custom"],
    customizable: {
      printOptions: [
        {
          id: "20x30",
          label: "20 x 30 cm",
          extraCost: 5,
          maxWidthCm: 20,
          maxHeightCm: 30,
        },
        {
          id: "30x40",
          label: "30 x 40 cm",
          extraCost: 9,
          maxWidthCm: 30,
          maxHeightCm: 40,
        },
        {
          id: "40x50",
          label: "40 x 50 cm",
          extraCost: 14,
          maxWidthCm: 40,
          maxHeightCm: 50,
        },
      ],
      colors: [
        { name: "Negro", hex: "#000000" },
        { name: "Blanco", hex: "#FFFFFF" },
        { name: "Rojo", hex: "#EF4444" },
        { name: "Azul", hex: "#3B82F6" },
        { name: "Verde", hex: "#22C55E" },
        { name: "Amarillo", hex: "#F59E0B" },
      ],
    },
  },
  {
    id: "cap-navy",
    name: "Fueradecontexto Cap – Navy",
    description: "Adjustable cap with embroidered logo.",
    price: 24,
    currency: "USD",
    imageUrl: "",
    availableSizes: ["S", "M", "L"],
    inStock: false,
    tags: ["cap", "navy"],
  },
];

// Expand base items into a larger mock catalog for pagination
const ALL_PRODUCTS: Product[] = Array.from({ length: 30 }).flatMap((_, i) => {
  const n = i + 1;
  return BASE_PRODUCTS.map((p, idx) => ({
    ...p,
    id: `${p.id}-${n}`,
    name:
      idx === 0
        ? `Fueradecontexto Tee – Black #${n}`
        : idx === 1
        ? `Fueradecontexto Hoodie – Grey #${n}`
        : `Fueradecontexto Cap – Navy #${n}`,
    // rotate stock state a bit
    inStock: (n + idx) % 4 !== 0,
  }));
});

type PageParams = { page: number; pageSize: number };
type PageResult = {
  items: Product[];
  hasMore: boolean;
  nextPage: number | null;
};

export const productsService = {
  async getAll(): Promise<Product[]> {
    // Ensure minimum 0.5s loading to show skeletons
    await sleep(550);
    return ALL_PRODUCTS;
  },
  async getPage({ page, pageSize }: PageParams): Promise<PageResult> {
    // Ensure minimum 0.5s loading to show skeletons before each page
    await sleep(550);
    const start = page * pageSize;
    const end = start + pageSize;
    const items = ALL_PRODUCTS.slice(start, end);
    const hasMore = end < ALL_PRODUCTS.length;
    return { items, hasMore, nextPage: hasMore ? page + 1 : null };
  },
  async getById(id: string): Promise<Product | undefined> {
    await sleep(300);
    return ALL_PRODUCTS.find((p) => p.id === id);
  },
};
