import { Metadata } from "next";

export const generateHomeMetadata = (): Metadata => {
  const title =
    "Fueradecontexto - Ropa Premium y Personalizada | Buzos, Remeras, Gorras";
  const description =
    "Fueradecontexto: Tu tienda de ropa premium argentina con personalización única. Buzos, remeras, gorras y tote bags de algodón premium. Estampas originales, serigrafía y bordado personalizado. Envíos a todo el país. Calidad garantizada.";
  const keywords =
    "ropa premium argentina, buzos personalizados, remeras personalizadas, gorras estampadas, tote bags, estampas personalizadas, ropa de calidad, moda urbana argentina, envíos nacionales, buzos con capucha, remeras básicas, gorras trucker, mochilas personalizadas, ropa unisex, estampas originales, diseño argentino, ropa sustentable, algodón premium, serigrafía, bordado personalizado";
  const url = "https://fueradecontexto.vercel.app";
  const imageUrl = `${url}/og-image.jpg`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Fueradecontexto" }],
    creator: "Fueradecontexto",
    publisher: "Fueradecontexto",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url,
      title,
      description,
      siteName: "Fueradecontexto",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Fueradecontexto - Ropa Premium Personalizada",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@fueradecontexto",
      site: "@fueradecontexto",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
      yahoo: "your-yahoo-verification-code",
    },
    category: "fashion",
    classification: "E-commerce, Fashion, Clothing",
    other: {
      "geo.region": "AR",
      "geo.country": "Argentina",
      "geo.placename": "Argentina",
      ICBM: "-34.6037, -58.3816",
      "DC.title": title,
      "DC.description": description,
      "DC.subject": keywords,
      "DC.language": "es",
      "DC.creator": "Fueradecontexto",
      "DC.publisher": "Fueradecontexto",
      "DC.date.created": "2024-01-01",
      "DC.date.modified": new Date().toISOString().split("T")[0],
    },
  };
};

export const generateProductMetadata = (product: {
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  category: string;
}): Metadata => {
  const title = `${product.name} - ${product.category} Premium | Fueradecontexto`;
  const description = `${
    product.description ||
    `Descubre ${
      product.name
    }, ${product.category.toLowerCase()} premium de alta calidad. Personalizable con estampas y colores exclusivos. Envíos a todo el país.`
  }`;
  const url = `https://fueradecontexto.vercel.app/product/${product.name
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
  const imageUrl =
    product.imageUrl || "https://fueradecontexto.vercel.app/og-image.jpg";

  return {
    title,
    description,
    keywords: `${product.name}, ${product.category}, ropa premium, personalización, estampas, ${product.currency} ${product.price}`,
    authors: [{ name: "Fueradecontexto" }],
    creator: "Fueradecontexto",
    publisher: "Fueradecontexto",
    metadataBase: new URL("https://fueradecontexto.vercel.app"),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url,
      title,
      description,
      siteName: "Fueradecontexto",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} - ${product.category} Premium`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@fueradecontexto",
      site: "@fueradecontexto",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "fashion",
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": product.currency,
      "product:availability": "in stock",
      "product:category": product.category,
    },
  };
};
