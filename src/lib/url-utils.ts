/**
 * Utility functions for generating SEO-friendly URLs
 */

/**
 * Converts a string to a URL-friendly slug
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Generates a unique product URL slug
 * Format: {product-name}-{color}-{id-suffix}
 * Example: "remera-rojo-abc123"
 */
export const generateProductSlug = (
  productName: string,
  colorName: string,
  productId: string
): string => {
  const productSlug = createSlug(productName);
  const colorSlug = createSlug(colorName);

  // Take last 6 characters of product ID for uniqueness
  const idSuffix = productId.slice(-6);

  return `${productSlug}-${colorSlug}-${idSuffix}`;
};

/**
 * Extracts product ID from a slug
 * Example: "remera-rojo-abc123" -> "abc123"
 */
export const extractProductIdFromSlug = (slug: string): string | null => {
  const parts = slug.split("-");
  if (parts.length < 3) return null;

  // Get the last part (ID suffix)
  const idSuffix = parts[parts.length - 1];

  // We need to find the full product ID that ends with this suffix
  // This will be handled by the product lookup logic
  return idSuffix;
};

/**
 * Parses a product slug to extract components
 * Returns: { productName, colorName, idSuffix }
 */
export const parseProductSlug = (
  slug: string
): {
  productName: string;
  colorName: string;
  idSuffix: string;
} | null => {
  const parts = slug.split("-");
  if (parts.length < 3) return null;

  const idSuffix = parts[parts.length - 1];
  const colorName = parts[parts.length - 2];

  // Everything before the last two parts is the product name
  const productName = parts.slice(0, -2).join("-");

  return {
    productName,
    colorName,
    idSuffix,
  };
};

/**
 * Finds a product by its slug components
 * This function will be used to resolve the full product ID
 */
export const findProductBySlug = (
  products: Array<{
    id: string;
    name: string;
    customizable?: { colors?: Array<{ name: string }> };
  }>,
  slug: string
): { product: (typeof products)[0]; colorName: string } | null => {
  const parsed = parseProductSlug(slug);
  if (!parsed) return null;

  const { productName, colorName, idSuffix } = parsed;

  // Find product by ID suffix
  const product = products.find((p) => p.id.endsWith(idSuffix));
  if (!product) return null;

  // Verify the product name matches (case-insensitive)
  const productSlug = createSlug(product.name);
  if (productSlug !== productName) return null;

  // Verify the color exists
  const color = product.customizable?.colors?.find(
    (c) => createSlug(c.name) === colorName
  );
  if (!color) return null;

  return { product, colorName: color.name };
};
