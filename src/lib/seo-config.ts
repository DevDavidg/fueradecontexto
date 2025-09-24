// Configuración centralizada de SEO para Fueradecontexto
export const SEO_CONFIG = {
  // Información básica del sitio
  site: {
    name: "Fueradecontexto",
    url: "https://fueradecontexto.vercel.app",
    description:
      "Tu tienda de ropa premium argentina con personalización única. Buzos, remeras, gorras y tote bags de algodón premium.",
    logo: "https://fueradecontexto.vercel.app/logo.png",
    favicon: "https://fueradecontexto.vercel.app/favicon.ico",
  },

  // Información de contacto y empresa
  business: {
    name: "Fueradecontexto",
    description: "Empresa especializada en ropa premium personalizada",
    phone: "+54-9-11-1234-5678",
    email: "info@fueradecontexto.com",
    address: {
      country: "AR",
      region: "Buenos Aires",
      city: "Buenos Aires",
    },
  },

  // Redes sociales
  social: {
    instagram: "https://www.instagram.com/fueradecontexto",
    tiktok: "https://www.tiktok.com/@fueradecontexto",
    facebook: "https://www.facebook.com/fueradecontexto",
    whatsapp: "https://wa.me/5491112345678",
  },

  // Keywords principales por categoría
  keywords: {
    general: [
      "ropa premium argentina",
      "buzos personalizados",
      "remeras personalizadas",
      "gorras estampadas",
      "tote bags",
      "estampas personalizadas",
      "ropa de calidad",
      "moda urbana argentina",
      "envíos nacionales",
      "serigrafía",
      "bordado personalizado",
      "algodón premium",
      "diseño argentino",
      "ropa sustentable",
    ],
    buzos: [
      "buzos con capucha",
      "buzos oversize",
      "buzos premium",
      "buzos personalizados argentina",
      "buzos de algodón",
      "buzos canguro",
      "buzos cuello redondo",
    ],
    gorras: [
      "gorras trucker",
      "gorras gabardina",
      "gorras estampadas",
      "gorras personalizadas",
      "gorras premium",
      "gorras argentina",
    ],
    camperas: [
      "camperas premium",
      "camperas personalizadas",
      "camperas argentina",
      "camperas de calidad",
    ],
    totebags: [
      "tote bags personalizados",
      "tote bags premium",
      "tote bags argentina",
      "mochilas personalizadas",
    ],
  },

  // Configuración de metadatos por página
  pages: {
    home: {
      title:
        "Fueradecontexto - Ropa Premium y Personalizada | Buzos, Remeras, Gorras",
      description:
        "Fueradecontexto: Tu tienda de ropa premium argentina con personalización única. Buzos, remeras, gorras y tote bags de algodón premium. Estampas originales, serigrafía y bordado personalizado. Envíos a todo el país. Calidad garantizada.",
    },
    products: {
      title: "Productos Premium Personalizados | Fueradecontexto",
      description:
        "Descubre nuestra colección de ropa premium personalizable. Buzos, remeras, gorras y tote bags de alta calidad con estampas originales. Envíos a todo el país.",
    },
    contact: {
      title: "Contacto | Fueradecontexto - Ropa Premium Personalizada",
      description:
        "Contacta con Fueradecontexto para consultas sobre productos, personalización y envíos. Atención al cliente especializada en ropa premium.",
    },
    about: {
      title: "Sobre Nosotros | Fueradecontexto - Ropa Premium Personalizada",
      description:
        "Conoce la historia de Fueradecontexto, tu tienda de ropa premium argentina. Calidad, diseño y personalización desde Buenos Aires.",
    },
  },

  // Configuración de robots y crawling
  robots: {
    allow: ["/", "/products", "/contactanos", "/sobre-nosotros"],
    disallow: [
      "/admin",
      "/api",
      "/mi-cuenta",
      "/checkout",
      "/_next",
      "/private",
    ],
  },

  // Configuración de sitemap
  sitemap: {
    changeFrequency: {
      home: "daily",
      products: "daily",
      categories: "weekly",
      static: "monthly",
    },
    priority: {
      home: 1.0,
      products: 0.9,
      categories: 0.8,
      product: 0.8,
      static: 0.6,
    },
  },
} as const;

// Función helper para generar títulos dinámicos
export const generatePageTitle = (
  page: string,
  productName?: string
): string => {
  const baseTitle =
    SEO_CONFIG.pages[page as keyof typeof SEO_CONFIG.pages]?.title ||
    SEO_CONFIG.pages.home.title;

  if (productName) {
    return `${productName} | ${SEO_CONFIG.site.name}`;
  }

  return baseTitle;
};

// Función helper para generar descripciones dinámicas
export const generatePageDescription = (
  page: string,
  productName?: string,
  category?: string
): string => {
  const baseDescription =
    SEO_CONFIG.pages[page as keyof typeof SEO_CONFIG.pages]?.description ||
    SEO_CONFIG.pages.home.description;

  if (productName && category) {
    return `Descubre ${productName}, ${category} premium de alta calidad. Personalizable con estampas y colores exclusivos. Envíos a todo el país.`;
  }

  return baseDescription;
};
