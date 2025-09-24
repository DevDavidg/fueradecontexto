export type CurrencyCode = "USD" | "EUR" | "MXN" | "COP" | "ARS" | "CLP";

export type PrintSizeId =
  | "hasta_15cm"
  | "hasta_20x30cm"
  | "hasta_30x40cm"
  | "hasta_40x50cm";

export type PrintPlacement = "front" | "back" | "front_back";

export type PrintOption = {
  id: PrintSizeId;
  label: string;
  extraCost: number;
  maxWidthCm: number;
  maxHeightCm: number;
};

export type StampOption = {
  id?: string;
  placement: PrintPlacement;
  size: PrintSizeId;
  label: string;
  extraCost: number;
};

export type ColorOption = {
  name: string;
  hex: string;
};

// Types for product data from JSON
export type ProductColor = {
  nombre: string;
  hex: string;
};

export type ProductImageData = {
  color: string;
  url: string;
};

export type ProductStock = {
  [color: string]: {
    [size: string]: number;
  };
};

export type ProductPrintSizes = {
  [key: string]: number;
};

export type RawProduct = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: {
    normal: number;
    transferencia: number;
  };
  metodos_pago: string[];
  envio: {
    metodo: string;
    codigo_postal: string;
  };
  talles?: string[];
  colores?: ProductColor[];
  imagenes?: ProductImageData[];
  tamaño_estampa?: ProductPrintSizes;
  stock?: ProductStock;
};

// Cookie options type for Supabase
export type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
};

export type ProductImage = {
  id: string;
  url: string;
  color: string;
  created_at: string;
  product_id: string;
};

export type Product = {
  id: string;
  name: string;
  categoria: string;
  description: string;
  price: number;
  currency: CurrencyCode;
  imageUrl: string;
  availableSizes: Array<"XS" | "S" | "M" | "L" | "XL" | "XXL" | "Único">;
  inStock: boolean;
  stock: number;
  tags: string[];
  product_images?: ProductImage[];
  stampOptions?: StampOption[];
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
  selectedSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Único";
  customization?: {
    printSizeId: PrintSizeId;
    printPlacement?: PrintPlacement;
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
