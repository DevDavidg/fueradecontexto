export type CheckoutCustomization = {
  printSizeId?: string;
  colorName?: string;
  extraCost?: number;
};

export type CheckoutItemPayload = {
  productId?: string;
  name?: string;
  price: number;
  quantity: number;
  currency?: string;
  selectedSize?: string;
  imageUrl?: string;
  customization?: CheckoutCustomization;
};

export type CreatePreferencePayload = {
  items: CheckoutItemPayload[];
};

export type PreferenceItemPayload = {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
  picture_url?: string;
};

export type PreferencePayload = {
  items: PreferenceItemPayload[];
  external_reference: string;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: "approved";
};

export type MercadoPagoPaymentItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  description?: string;
};

export type MercadoPagoPayment = {
  id: number;
  status: string;
  external_reference?: string;
  transaction_amount: number;
  currency_id: string;
  payer?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  additional_info?: {
    items?: MercadoPagoPaymentItem[];
  };
};

export type MercadoPagoPaymentSearchResponse = {
  results: Array<{
    id: number;
  }>;
};

