"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CartSidebar } from "@/components/ecommerce/cart-sidebar";

export const Navbar = () => {
  return (
    <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav
        className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between gap-4"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
          aria-label="Fueradecontexto Home"
        >
          Fueradecontexto
        </Link>
        <div className="hidden md:flex items-center gap-2 min-w-[320px] grow max-w-md">
          <Input
            placeholder="Buscar productos"
            aria-label="Buscar productos"
            fullWidth
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="text-sm text-neutral-700 hover:underline"
            aria-label="Ver productos"
          >
            Productos
          </Link>
          <Link
            href="/checkout"
            className="text-sm text-neutral-700 hover:underline"
            aria-label="Ir al checkout"
          >
            Checkout
          </Link>
          <CartSidebar />
        </div>
      </nav>
    </header>
  );
};
