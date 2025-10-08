import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { Banner } from "@/components/molecules/banner";
import { generateHomeMetadata } from "@/lib/seo-metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "900"],
});

export const metadata: Metadata = generateHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preconnect"
          href="https://glbwyjwetgqxsjncpyhe.supabase.co"
        />
        <link
          rel="dns-prefetch"
          href="https://glbwyjwetgqxsjncpyhe.supabase.co"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Only register service worker in production
              if ('serviceWorker' in navigator && window.location.protocol === 'https:' && !window.location.hostname.includes('localhost')) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
              
              // Simple performance monitoring
              if (typeof window !== 'undefined' && 'performance' in window) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    // Monitor Core Web Vitals
                    const observer = new PerformanceObserver(function(list) {
                      for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                          console.log('Performance metric: LCP = ' + entry.startTime + 'ms');
                        } else if (entry.entryType === 'first-input') {
                          console.log('Performance metric: FID = ' + (entry.processingStart - entry.startTime) + 'ms');
                        } else if (entry.entryType === 'layout-shift') {
                          if (!entry.hadRecentInput && entry.value > 0.1) {
                            console.log('Performance metric: CLS = ' + entry.value + 'ms');
                          }
                        } else if (entry.entryType === 'paint') {
                          if (entry.name === 'first-contentful-paint') {
                            console.log('Performance metric: FCP = ' + entry.startTime + 'ms');
                          }
                        } else if (entry.entryType === 'navigation') {
                          console.log('Performance metric: TTFB = ' + (entry.responseStart - entry.requestStart) + 'ms');
                        }
                      }
                    });
                    
                    try {
                      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] });
                    } catch (e) {
                      console.warn('Performance monitoring not fully supported');
                    }
                  }, 1000);
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-black text-[#ededed] min-h-dvh`}
      >
        <Banner />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
