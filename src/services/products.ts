import { type Product } from "@/lib/types";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "tee-black",
    name: "Fueradecontexto Tee – Black",
    description: "Soft cotton tee with minimal branding.",
    price: 29,
    currency: "USD",
    imageUrl: "/window.svg",
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
    imageUrl: "/globe.svg",
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
    imageUrl: "/file.svg",
    availableSizes: ["S", "M", "L"],
    inStock: false,
    tags: ["cap", "navy"],
  },
];

export const productsService = {
  async getAll(): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_PRODUCTS;
  },
};
