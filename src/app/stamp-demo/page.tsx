"use client";

import { useState } from "react";
import { Navbar } from "@/components/organisms/navbar";
import { StampSelector } from "@/components/molecules/stamp-selector";
import { StampSelectorCompact } from "@/components/molecules/stamp-selector-compact";
import { type StampOption } from "@/lib/types";
import { formatCurrency } from "@/lib/format-currency";

const DEMO_STAMP_OPTIONS: StampOption[] = [
  // Adelante
  {
    id: "1",
    placement: "front",
    size: "hasta_15cm",
    label: "Adelante - Hasta 15cm",
    extraCost: 0,
  },
  {
    id: "2",
    placement: "front",
    size: "hasta_20x30cm",
    label: "Adelante - Hasta 20x30cm",
    extraCost: 500,
  },
  {
    id: "3",
    placement: "front",
    size: "hasta_30x40cm",
    label: "Adelante - Hasta 30x40cm",
    extraCost: 1000,
  },
  {
    id: "4",
    placement: "front",
    size: "hasta_40x50cm",
    label: "Adelante - Hasta 40x50cm",
    extraCost: 1500,
  },

  // Atrás
  {
    id: "5",
    placement: "back",
    size: "hasta_15cm",
    label: "Atrás - Hasta 15cm",
    extraCost: 0,
  },
  {
    id: "6",
    placement: "back",
    size: "hasta_20x30cm",
    label: "Atrás - Hasta 20x30cm",
    extraCost: 500,
  },
  {
    id: "7",
    placement: "back",
    size: "hasta_30x40cm",
    label: "Atrás - Hasta 30x40cm",
    extraCost: 1000,
  },
  {
    id: "8",
    placement: "back",
    size: "hasta_40x50cm",
    label: "Atrás - Hasta 40x50cm",
    extraCost: 1500,
  },

  // Adelante + Atrás
  {
    id: "9",
    placement: "front_back",
    size: "hasta_15cm",
    label: "Adelante + Atrás - Hasta 15cm",
    extraCost: 0,
  },
  {
    id: "10",
    placement: "front_back",
    size: "hasta_20x30cm",
    label: "Adelante + Atrás - Hasta 20x30cm",
    extraCost: 1000,
  },
  {
    id: "11",
    placement: "front_back",
    size: "hasta_30x40cm",
    label: "Adelante + Atrás - Hasta 30x40cm",
    extraCost: 2000,
  },
  {
    id: "12",
    placement: "front_back",
    size: "hasta_40x50cm",
    label: "Adelante + Atrás - Hasta 40x50cm",
    extraCost: 2500,
  },
];

export default function StampDemoPage() {
  const [selectedOption, setSelectedOption] = useState<StampOption | null>(
    null
  );
  const [selectedCompactOption, setSelectedCompactOption] =
    useState<StampOption | null>(null);

  const basePrice = 5000;
  const totalPrice = basePrice + (selectedOption?.extraCost ?? 0);
  const totalCompactPrice = basePrice + (selectedCompactOption?.extraCost ?? 0);

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Demo: Selector de Estampado
            </h1>
            <p className="text-neutral-400 text-sm md:text-base">
              Componente para personalización de productos con opciones de
              estampado
            </p>
          </div>

          {/* Full Version */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">
                Versión Completa (StampSelector)
              </h2>
              <p className="text-sm text-neutral-400">
                Ideal para páginas de detalle de productos con espacio
                suficiente
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <StampSelector
                  stampOptions={DEMO_STAMP_OPTIONS}
                  selectedOption={selectedOption}
                  onSelectOption={setSelectedOption}
                  currency="ARS"
                />
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Información del Producto
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Precio base:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(basePrice, "ARS")}
                      </span>
                    </div>
                    {selectedOption && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Estampado:</span>
                          <span className="text-pink-400 font-medium">
                            + {formatCurrency(selectedOption.extraCost, "ARS")}
                          </span>
                        </div>
                        <div className="h-px bg-neutral-800 my-2" />
                      </>
                    )}
                    <div className="flex justify-between text-base">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-pink-500 font-bold">
                        {formatCurrency(totalPrice, "ARS")}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOption && (
                  <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-pink-500/30">
                    <h3 className="text-sm font-semibold text-pink-400 mb-2">
                      Opción seleccionada
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Label:</span>
                        <span className="text-white font-medium">
                          {selectedOption.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Ubicación:</span>
                        <span className="text-white font-medium">
                          {selectedOption.placement}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Tamaño:</span>
                        <span className="text-white font-medium">
                          {selectedOption.size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-300">Costo extra:</span>
                        <span className="text-pink-400 font-medium">
                          {formatCurrency(selectedOption.extraCost, "ARS")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedOption && (
                  <div className="bg-neutral-900/50 rounded-lg p-4 border border-dashed border-neutral-700 text-center">
                    <p className="text-sm text-neutral-500">
                      Selecciona una opción de estampado para ver los detalles
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact Version */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">
                Versión Compacta (StampSelectorCompact)
              </h2>
              <p className="text-sm text-neutral-400">
                Ideal para checkout, modales o espacios reducidos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <StampSelectorCompact
                  stampOptions={DEMO_STAMP_OPTIONS}
                  selectedOption={selectedCompactOption}
                  onSelectOption={setSelectedCompactOption}
                  currency="ARS"
                />

                {selectedCompactOption && (
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
                    <h3 className="text-sm font-semibold text-green-400 mb-2">
                      ✓ Selección confirmada
                    </h3>
                    <p className="text-xs text-neutral-300">
                      {selectedCompactOption.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Resumen de Compra
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Producto:</span>
                    <span className="text-white font-medium">
                      {formatCurrency(basePrice, "ARS")}
                    </span>
                  </div>
                  {selectedCompactOption &&
                    selectedCompactOption.extraCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Estampado:</span>
                        <span className="text-pink-400 font-medium">
                          +{" "}
                          {formatCurrency(
                            selectedCompactOption.extraCost,
                            "ARS"
                          )}
                        </span>
                      </div>
                    )}
                  <div className="h-px bg-neutral-800 my-2" />
                  <div className="flex justify-between text-base">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-pink-500 font-bold">
                      {formatCurrency(totalCompactPrice, "ARS")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Características
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "UI Moderna",
                  description:
                    "Diseño oscuro con acentos rosa/fucsia, consistente con el proyecto",
                  icon: "🎨",
                },
                {
                  title: "Responsive",
                  description:
                    "Funciona perfectamente en móviles, tablets y desktop",
                  icon: "📱",
                },
                {
                  title: "Agrupación",
                  description:
                    "Opciones organizadas automáticamente por ubicación",
                  icon: "📂",
                },
                {
                  title: "Indicadores",
                  description: "Visuales claros de selección y costos",
                  icon: "✓",
                },
                {
                  title: "Animaciones",
                  description: "Transiciones suaves en hover y selección",
                  icon: "✨",
                },
                {
                  title: "Accesible",
                  description: "Labels, focus states y contraste adecuados",
                  icon: "♿",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800 hover:border-neutral-700 transition-colors"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Uso Básico
            </h2>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-xs md:text-sm border border-neutral-800">
              <code className="text-green-400">
                {`import { StampSelector } from "@/components/molecules/stamp-selector";
import { useState } from "react";

function ProductPage() {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <StampSelector
      stampOptions={product.stampOptions}
      selectedOption={selectedOption}
      onSelectOption={setSelectedOption}
      currency={product.currency}
    />
  );
}`}
              </code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
