"use client";

import { Navbar } from "@/components/organisms/navbar";
import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 md:px-6 py-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-4">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Pago cancelado</h1>
          <p className="text-neutral-400 text-lg">
            El pago no pudo ser procesado. Por favor, intenta nuevamente.
          </p>
          <div className="pt-6 space-x-4">
            <Link
              href="/checkout"
              className="inline-block px-6 py-3 rounded-md bg-[#C2187A] text-white hover:bg-pink-700 transition-colors"
            >
              Intentar nuevamente
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
