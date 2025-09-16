"use client";

import Link from "next/link";
import { TikTokIcon, WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";

type HomeHeroProps = {
  title?: string | null;
  description?: string | null;
  isLoading?: boolean;
};

export const HomeHero = ({ title, description, isLoading }: HomeHeroProps) => {
  const showSkeleton = isLoading || (!title && !description);

  if (showSkeleton) {
    return (
      <section className="min-h-screen bg-black relative">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-left px-8 max-w-6xl mx-auto w-full">
            {/* Main Heading Skeleton */}
            <div className="mb-12">
              <div className="mb-3">
                <div className="h-12 sm:h-16 md:h-20 lg:h-24 w-full max-w-4xl bg-neutral-800 rounded animate-pulse" />
              </div>
              <div className="mb-3">
                <div className="h-12 sm:h-16 md:h-20 lg:h-24 w-full max-w-3xl bg-neutral-800 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-12 sm:h-16 md:h-20 lg:h-24 w-full max-w-4xl bg-neutral-800 rounded animate-pulse" />
              </div>
            </div>

            {/* Subtitle Skeleton */}
            <div className="mb-12">
              <div className="h-6 sm:h-7 w-full max-w-md bg-neutral-800 rounded animate-pulse" />
            </div>

            {/* CTA Button Skeleton */}
            <div className="h-12 w-32 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Social Media Icons Skeleton - Bottom Right */}
        <div
          className="absolute right-0 sm:right-6 md:right-8 flex space-x-4"
          style={{ bottom: "200px" }}
        >
          <div className="w-12 h-12 bg-neutral-800 rounded-full animate-pulse" />
          <div className="w-12 h-12 bg-neutral-800 rounded-full animate-pulse" />
          <div className="w-12 h-12 bg-neutral-800 rounded-full animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black relative">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-left px-8 max-w-6xl mx-auto w-full">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-none mb-12">
            <div className="mb-3">
              NO SEGUIMOS <span className="text-pink-500">TENDENCIAS</span>
            </div>
            <div className="mb-3">
              CREAMOS <span className="text-pink-500">PRENDAS</span> QUE
            </div>
            <div>
              CUENTAN TU <span className="text-pink-500">HISTORIA.</span>
            </div>
          </h1>

          {/* Subtitle */}
          <div className="mb-12">
            <p className="text-white text-lg sm:text-xl font-light">
              El detalle{" "}
              <span className="text-pink-500 border-b-2 border-pink-500">
                hace la diferencia
              </span>
            </p>
          </div>

          {/* CTA Button */}
          <Link href="/products">
            <button className="border-2 border-white text-white px-10 py-3 text-lg font-medium uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
              EXPLORAR
            </button>
          </Link>
        </div>
      </div>

      {/* Social Media Icons - Bottom Right */}
      <div className="absolute right-0 sm:right-6 md:right-8 flex space-x-4">
        <style jsx>{`
          @keyframes bounceUp1 {
            0% {
              bottom: 0px;
            }
            40% {
              bottom: 260px;
            }
            60% {
              bottom: 200px;
            }
            75% {
              bottom: 220px;
            }
            85% {
              bottom: 200px;
            }
            92% {
              bottom: 210px;
            }
            100% {
              bottom: 200px;
            }
          }
          @keyframes bounceUp2 {
            0% {
              bottom: 0px;
            }
            40% {
              bottom: 250px;
            }
            60% {
              bottom: 200px;
            }
            75% {
              bottom: 215px;
            }
            85% {
              bottom: 200px;
            }
            92% {
              bottom: 208px;
            }
            100% {
              bottom: 200px;
            }
          }
          @keyframes bounceUp3 {
            0% {
              bottom: 0px;
            }
            40% {
              bottom: 240px;
            }
            60% {
              bottom: 200px;
            }
            75% {
              bottom: 212px;
            }
            85% {
              bottom: 200px;
            }
            92% {
              bottom: 206px;
            }
            100% {
              bottom: 200px;
            }
          }
        `}</style>
        <a
          href="#"
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-pink-500 hover:text-white transition-all duration-300 relative"
          aria-label="TikTok"
          style={{
            animation: "bounceUp1 2s ease-in-out forwards",
          }}
        >
          <TikTokIcon size={20} />
        </a>
        <a
          href="#"
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-pink-500 hover:text-white transition-all duration-300 relative"
          aria-label="WhatsApp"
          style={{
            animation: "bounceUp2 2s ease-in-out forwards",
          }}
        >
          <WhatsAppIcon size={20} />
        </a>
        <a
          href="#"
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-pink-500 hover:text-white transition-all duration-300 relative"
          aria-label="Instagram"
          style={{
            animation: "bounceUp3 2s ease-in-out forwards",
          }}
        >
          <InstagramIcon size={20} />
        </a>
      </div>
    </section>
  );
};
