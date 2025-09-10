export type CurrencyCode = "USD" | "EUR" | "MXN" | "COP" | "ARS" | "CLP";

export type PrintSizeId = "20x30" | "30x40" | "40x50";

export type PrintOption = {
  id: PrintSizeId;
  label: string;
  extraCost: number;
  maxWidthCm: number;
  maxHeightCm: number;
};

export type ColorOption = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  name: string;
  categoria: string;
  description: string;
  price: number;
  currency: CurrencyCode;
  imageUrl: string;
  availableSizes: Array<"XS" | "S" | "M" | "L" | "XL" | "XXL">;
  inStock: boolean;
  tags: string[];
  customizable?: {
    printOptions: PrintOption[];
    colors: ColorOption[];
  };
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  currency: CurrencyCode;
  quantity: number;
  imageUrl: string;
  selectedSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  customization?: {
    printSizeId: PrintSizeId;
    colorName: string;
    colorHex: string;
    extraCost: number;
  };
};

export type CartState = {
  items: CartItem[];
};

export const calculateCartTotals = (cart: CartState) => {
  const subtotal = cart.items.reduce((accumulator, item) => {
    const unitExtra = item.customization?.extraCost ?? 0;
    const unitTotal = item.price + unitExtra;
    return accumulator + unitTotal * item.quantity;
  }, 0);
  return { subtotal };
};
