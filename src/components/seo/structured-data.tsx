import Script from "next/script";

interface StructuredDataProps {
  type: "website" | "organization" | "product" | "breadcrumb";
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  type,
  data,
}) => {
  const getStructuredData = () => {
    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Fueradecontexto",
          description:
            "Tienda de ropa premium con personalización única. Buzos, remeras, gorras y tote bags de alta calidad.",
          url: "https://fueradecontexto.vercel.app",
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://fueradecontexto.vercel.app/products?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
          publisher: {
            "@type": "Organization",
            name: "Fueradecontexto",
            url: "https://fueradecontexto.vercel.app",
            logo: {
              "@type": "ImageObject",
              url: "https://fueradecontexto.vercel.app/logo.png",
            },
          },
        };

      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Fueradecontexto",
          description: "Empresa especializada en ropa premium personalizada",
          url: "https://fueradecontexto.vercel.app",
          logo: "https://fueradecontexto.vercel.app/logo.png",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+54-9-11-1234-5678",
            contactType: "customer service",
            availableLanguage: "Spanish",
            areaServed: "AR",
            contactOption: "TollFree",
          },
          sameAs: [
            "https://www.instagram.com/fueradecontexto",
            "https://www.tiktok.com/@fueradecontexto",
            "https://wa.me/5491112345678",
            "https://www.facebook.com/fueradecontexto",
          ],
          address: {
            "@type": "PostalAddress",
            addressCountry: "AR",
            addressRegion: "Buenos Aires",
          },
        };

      case "product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: data.name,
          description: data.description,
          image: data.images || [],
          brand: {
            "@type": "Brand",
            name: "Fueradecontexto",
          },
          offers: {
            "@type": "Offer",
            price: data.price,
            priceCurrency: data.currency,
            availability: data.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "Fueradecontexto",
            },
          },
          category: data.category,
          additionalProperty: data.customizable
            ? [
                {
                  "@type": "PropertyValue",
                  name: "Personalizable",
                  value: "Sí",
                },
                {
                  "@type": "PropertyValue",
                  name: "Colores disponibles",
                  value: data.customizable.colors?.length || 0,
                },
              ]
            : [],
        };

      case "breadcrumb":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };

      default:
        return {};
    }
  };

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
};

// Componente específico para la página home
export const HomeStructuredData: React.FC = () => {
  return (
    <>
      <StructuredData type="website" data={{}} />
      <StructuredData type="organization" data={{}} />
    </>
  );
};

// Componente para productos
export const ProductStructuredData: React.FC<{
  product: {
    name: string;
    description?: string;
    price: number;
    currency: string;
    images?: string[];
    category: string;
    inStock: boolean;
    customizable?: {
      colors?: any[];
    };
  };
}> = ({ product }) => {
  return <StructuredData type="product" data={product} />;
};
