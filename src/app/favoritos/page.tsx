"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/use-favorites";
import { ProductCard } from "@/components/molecules/product-card";
import { useCart } from "@/hooks/use-cart";
import { HeartIcon } from "@/components/ui/icons";
import { Navbar } from "@/components/organisms/navbar";

export default function FavoritosPage() {
  const { favorites } = useFavorites();
  const { addItem } = useCart();

  if (favorites.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-[#ededed]">
        <Navbar />
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-lg mx-auto">
            {/* Enhanced Empty State Illustration */}
            <div className="relative mb-10">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-full flex items-center justify-center mb-6 border-2 border-gray-600 shadow-2xl">
                <HeartIcon className="w-16 h-16 text-gray-400" />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-lg font-bold">+</span>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute top-1/2 -left-4 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-40 animate-ping"></div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Tu lista de favoritos está vacía
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                ¡Es hora de descubrir productos increíbles! Haz clic en el
                corazón de cualquier producto para agregarlo a tus favoritos y
                encontrarlo fácilmente más tarde.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <HeartIcon className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Guarda favoritos
                </h3>
                <p className="text-xs text-gray-400">Clic en el corazón</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Acceso rápido
                </h3>
                <p className="text-xs text-gray-400">Desde cualquier lugar</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Siempre guardado
                </h3>
                <p className="text-xs text-gray-400">Se mantiene local</p>
              </div>
            </div>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#C2187A] to-[#D63384] text-white font-semibold rounded-xl hover:from-[#D63384] hover:to-[#C2187A] transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-[#C2187A]/30"
              >
                <svg
                  className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Explorar productos
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <Link
                href="/"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-gray-500 hover:text-white hover:bg-gray-800/30 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <HeartIcon className="w-5 h-5 text-white fill-current" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Mis Favoritos
                </h1>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                {favorites.items.length} producto
                {favorites.items.length !== 1 ? "s" : ""} guardado
                {favorites.items.length !== 1 ? "s" : ""} en tu lista
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Agregar más
              </Link>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {favorites.items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => addItem(product)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              ¿Buscas algo más?
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              Explora nuestra colección completa de productos únicos
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#C2187A] to-[#D63384] text-white font-semibold rounded-xl hover:from-[#D63384] hover:to-[#C2187A] transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-[#C2187A]/25"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Ver todos los productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
