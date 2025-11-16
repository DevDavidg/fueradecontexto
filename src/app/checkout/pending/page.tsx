"use client";

import { Navbar } from "@/components/organisms/navbar";
import Link from "next/link";

export default function CheckoutPendingPage() {
  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 md:px-6 py-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 mb-4">
            <svg
              className="w-10 h-10 text-yellow-500 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Pago pendiente</h1>
          <p className="text-neutral-400 text-lg">
            Tu pago está siendo procesado. Recibirás un correo de confirmación
            una vez que sea aprobado.
          </p>
          <div className="pt-6">
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-md bg-[#C2187A] text-white hover:bg-pink-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
