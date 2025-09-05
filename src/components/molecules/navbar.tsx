"use client";

import Link from "next/link";
import { CartSidebar } from "@/components/ecommerce/cart-sidebar";

export const Navbar = () => {
  return (
    <header className="w-full border-b border-[#333333] bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/60 relative z-[3000]">
      <nav
        className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center gap-6"
        aria-label="Primary"
      >
        {/* Left: Logo/Brand */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-6 h-6 rounded-sm bg-black border border-[#333333]"
            aria-hidden
          />
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-[#ededed] uppercase"
            aria-label="Fueradecontexto Home"
          >
            Fueradecontexto
          </Link>
        </div>

        {/* Center: Nav links */}
        <ul className="hidden md:flex items-center gap-8 mx-auto">
          <li>
            <Link href="/" className="text-sm text-neutral-300 hover:underline">
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="text-sm text-neutral-300 hover:underline"
            >
              Productos
            </Link>
          </li>
          <li>
            <a
              href="#about"
              className="text-sm text-neutral-300 hover:underline"
            >
              Sobre nosotros
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-sm text-neutral-300 hover:underline"
            >
              Contáctenos
            </a>
          </li>
        </ul>

        {/* Right: Icons */}
        <div className="flex items-center gap-4 ml-auto">
          <CartSidebar />
          <button
            className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#333333] text-[#ededed]"
            aria-label="Productos favoritos"
            title="Productos favoritos"
          >
            ★
          </button>
        </div>
      </nav>
    </header>
  );
};
