"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CartSidebar } from "@/components/organisms/cart-sidebar";
import { HeartIcon } from "@/components/ui/icons";
import { useFavorites } from "@/hooks/use-favorites";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { favorites } = useFavorites();

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!open) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <header
      ref={containerRef}
      className="w-full border-b border-[#333333] bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/60 relative z-[3000]"
    >
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
            className="text-sm tracking-wide text-[#ededed] uppercase font-logo-header"
            aria-label="Fueradecontexto Home"
          >
            Fueradecontexto
          </Link>
        </div>

        {/* Center: Nav links (desktop) */}
        <ul className="hidden md:flex items-center gap-8 mx-auto">
          <li>
            <Link
              href="/"
              className="text-sm text-neutral-300 hover:text-[#e12afb] hover:underline"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="text-sm text-neutral-300 hover:text-[#e12afb] hover:underline"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              href="/sobre-nosotros"
              className="text-sm text-neutral-300 hover:text-[#e12afb] hover:underline"
            >
              Sobre nosotros
            </Link>
          </li>
          <li>
            <Link
              href="/contactanos"
              className="text-sm text-neutral-300 hover:text-[#e12afb] hover:underline"
            >
              Contacto
            </Link>
          </li>
          <li>
            <Link
              href="/favoritos"
              className="text-sm text-neutral-300 hover:text-[#e12afb] hover:underline"
            >
              Favoritos
            </Link>
          </li>
          <li>
            <Link
              href="/mi-cuenta"
              className="text-sm text-neutral-300 hover:text-[#e12afb] hover:underline"
            >
              Mi Cuenta
            </Link>
          </li>
        </ul>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#333333] text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>

          <CartSidebar />
          <Link
            href="/favoritos"
            className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#333333] text-fuchsia-500 hover:text-fuchsia-400 hover:border-fuchsia-400 transition-colors relative"
            aria-label="Productos favoritos"
            title="Productos favoritos"
          >
            <HeartIcon className="w-4 h-4" />
            {favorites.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {favorites.items.length}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden z-[2000]"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={
          "md:hidden absolute left-0 right-0 top-16 border-t border-[#333333] bg-black/90 backdrop-blur p-4 z-[2500] " +
          (open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none")
        }
        style={{ transition: "opacity 150ms ease, transform 150ms ease" }}
        role="menu"
        aria-label="Menú móvil"
      >
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="/"
              className="block px-2 py-2 rounded text-sm text-neutral-200 hover:bg-[#151515]"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="block px-2 py-2 rounded text-sm text-neutral-200 hover:bg-[#151515]"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              href="/sobre-nosotros"
              className="block px-2 py-2 rounded text-sm text-neutral-200 hover:bg-[#151515]"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Sobre nosotros
            </Link>
          </li>
          <li>
            <Link
              href="/contactanos"
              className="block px-2 py-2 rounded text-sm text-neutral-200 hover:bg-[#151515]"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Contacto
            </Link>
          </li>
          <li>
            <Link
              href="/favoritos"
              className="block px-2 py-2 rounded text-sm text-neutral-200 hover:bg-[#151515] flex items-center gap-2"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <HeartIcon className="w-4 h-4" />
              Favoritos
              {favorites.items.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                  {favorites.items.length}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/mi-cuenta"
              className="block px-2 py-2 rounded text-sm text-neutral-200 hover:bg-[#151515]"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Mi Cuenta
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};
