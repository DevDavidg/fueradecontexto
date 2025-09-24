// Configuración de imágenes Open Graph para SEO
export const OG_IMAGES = {
  // Imagen principal del sitio
  DEFAULT: "https://fueradecontexto.vercel.app/og-image.jpg",
  
  // Imágenes por categoría
  BUZOS: "https://fueradecontexto.vercel.app/og-buzos.jpg",
  GORRAS: "https://fueradecontexto.vercel.app/og-gorras.jpg", 
  CAMPERAS: "https://fueradecontexto.vercel.app/og-camperas.jpg",
  TOTEBAGS: "https://fueradecontexto.vercel.app/og-totebags.jpg",
  
  // Imágenes específicas de productos
  PRODUCT: (productName: string, color?: string) => 
    `https://fueradecontexto.vercel.app/og-product-${productName.toLowerCase().replace(/\s+/g, '-')}${color ? `-${color.toLowerCase()}` : ''}.jpg`,
} as const;

// Dimensiones recomendadas para imágenes OG
export const OG_IMAGE_DIMENSIONS = {
  width: 1200,
  height: 630,
  alt: "Fueradecontexto - Ropa Premium Personalizada"
} as const;

// Generar URL de imagen OG basada en el contexto
export const generateOGImageUrl = (context: {
  type: 'home' | 'product' | 'category' | 'page';
  productName?: string;
  category?: string;
  color?: string;
}): string => {
  switch (context.type) {
    case 'home':
      return OG_IMAGES.DEFAULT;
    case 'product':
      return context.productName 
        ? OG_IMAGES.PRODUCT(context.productName, context.color)
        : OG_IMAGES.DEFAULT;
    case 'category':
      switch (context.category) {
        case 'buzos':
          return OG_IMAGES.BUZOS;
        case 'gorras':
          return OG_IMAGES.GORRAS;
        case 'camperas':
          return OG_IMAGES.CAMPERAS;
        case 'totebags':
          return OG_IMAGES.TOTEBAGS;
        default:
          return OG_IMAGES.DEFAULT;
      }
    default:
      return OG_IMAGES.DEFAULT;
  }
};
