import Head from "next/head";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: Record<string, unknown>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Fueradecontexto - Ropa Premium Personalizada",
  description = "Descubre Fueradecontexto, tu tienda de ropa premium con personalización única. Buzos, remeras, gorras y tote bags de alta calidad.",
  keywords = "ropa premium, buzos personalizados, remeras personalizadas, gorras, tote bags, estampas, personalización",
  canonical,
  ogImage = "https://fueradecontexto.vercel.app/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
}) => {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Fueradecontexto" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta
        property="og:url"
        content={canonical || "https://fueradecontexto.vercel.app"}
      />
      <meta property="og:site_name" content="Fueradecontexto" />
      <meta property="og:locale" content="es_AR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@fueradecontexto" />
      <meta name="twitter:creator" content="@fueradecontexto" />

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="AR" />
      <meta name="geo.country" content="Argentina" />
      <meta name="geo.placename" content="Argentina" />
      <meta name="ICBM" content="-34.6037, -58.3816" />

      {/* Dublin Core */}
      <meta name="DC.title" content={title} />
      <meta name="DC.description" content={description} />
      <meta name="DC.subject" content={keywords} />
      <meta name="DC.language" content="es" />
      <meta name="DC.creator" content="Fueradecontexto" />
      <meta name="DC.publisher" content="Fueradecontexto" />
      <meta name="DC.date.created" content="2024-01-01" />
      <meta
        name="DC.date.modified"
        content={new Date().toISOString().split("T")[0]}
      />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="Fueradecontexto" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://glbwyjwetgqxsjncpyhe.supabase.co" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
};
