import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/mi-cuenta/",
        "/checkout/",
        "/_next/",
        "/private/",
      ],
    },
    sitemap: "https://fueradecontexto.vercel.app/sitemap.xml",
    host: "https://fueradecontexto.vercel.app",
  };
}
