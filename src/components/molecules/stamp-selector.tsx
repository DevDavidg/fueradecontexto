"use client";

import * as React from "react";
import { clsx } from "clsx";
import {
  type StampOption,
  type PrintSizeId,
  type PrintPlacement,
} from "@/lib/types";

export type StampSelectorProps = {
  selectedOption?: StampOption;
  onOptionChange: (option: StampOption) => void;
  productId: string;
  stampOptions?: StampOption[];
  compact?: boolean;
  className?: string;
};

const getPlacementIcon = (placement: PrintPlacement) => {
  switch (placement) {
    case "front":
      return "🔴"; // Front indicator
    case "back":
      return "🔵"; // Back indicator
    case "front_back":
      return "🔴🔵"; // Both indicators
    default:
      return "⚪";
  }
};

const getPlacementText = (placement: PrintPlacement) => {
  switch (placement) {
    case "front":
      return "Adelante";
    case "back":
      return "Atrás";
    case "front_back":
      return "Adelante + Atrás";
    default:
      return "Sin especificar";
  }
};

export const StampSelector: React.FC<StampSelectorProps> = ({
  selectedOption,
  onOptionChange,
  productId,
  stampOptions = [],
  compact = false,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOptionSelect = React.useCallback(
    (option: StampOption) => {
      onOptionChange(option);
      setIsOpen(false);
    },
    [onOptionChange]
  );

  // If no stamp options are provided, don't render anything
  if (!stampOptions || stampOptions.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={clsx("relative", className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "w-full px-4 py-3 text-left bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-lg text-sm text-neutral-200 transition-all duration-200",
            "hover:border-neutral-600 hover:bg-neutral-800/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]/60",
            isOpen && "border-[var(--accent)]/60 bg-neutral-800/80"
          )}
          aria-label="Seleccionar opción de estampa"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedOption ? (
                <>
                  <div className="flex items-center justify-center w-6 h-6 bg-neutral-800 rounded-full text-xs">
                    {getPlacementIcon(selectedOption.placement)}
                  </div>
                  <div className="flex-1">
                    <span className="text-neutral-100 font-medium">
                      {selectedOption.label}
                    </span>
                    {selectedOption.extraCost > 0 && (
                      <span className="text-xs text-green-400 font-medium ml-2">
                        +${selectedOption.extraCost}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-6 h-6 bg-neutral-800 rounded-full text-xs">
                    🎨
                  </div>
                  <span className="text-neutral-400">Personalizar estampa</span>
                </>
              )}
            </div>
            <svg
              className={clsx(
                "w-4 h-4 transition-transform duration-200",
                isOpen ? "rotate-180" : "rotate-0"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute z-20 w-full mt-2 bg-neutral-900/95 backdrop-blur-md border border-neutral-700/50 rounded-lg shadow-2xl max-h-80 overflow-hidden">
              <div className="p-2">
                <div className="text-xs font-medium text-neutral-400 px-3 py-2 border-b border-neutral-800/50">
                  Opciones de personalización
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {stampOptions.map((option, index) => (
                    <button
                      key={`${productId}-stamp-${index}`}
                      type="button"
                      onClick={() => handleOptionSelect(option)}
                      className={clsx(
                        "w-full px-3 py-3 text-left text-sm transition-all duration-150 flex items-center gap-3 rounded-md mx-1 my-0.5",
                        selectedOption?.placement === option.placement &&
                          selectedOption?.size === option.size
                          ? "bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30"
                          : "text-neutral-200 hover:bg-neutral-800/60 hover:text-neutral-100"
                      )}
                    >
                      <div className="flex items-center justify-center w-6 h-6 bg-neutral-800/50 rounded-full text-xs">
                        {getPlacementIcon(option.placement)}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium block">
                          {option.label}
                        </span>
                        <span className="text-xs text-neutral-500 block">
                          {option.placement === "front_back"
                            ? "Ambos lados"
                            : option.placement === "front"
                            ? "Solo adelante"
                            : "Solo atrás"}
                        </span>
                      </div>
                      {option.extraCost > 0 ? (
                        <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                          +${option.extraCost}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500 bg-neutral-800/50 px-2 py-1 rounded-full">
                          Gratis
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 bg-neutral-800 rounded-full text-xs">
          🎨
        </div>
        <h3 className="text-sm font-medium text-neutral-200">
          Opciones de personalización
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {stampOptions.map((option, index) => {
          const isSelected =
            selectedOption?.placement === option.placement &&
            selectedOption?.size === option.size;
          return (
            <label
              key={`${productId}-stamp-${index}`}
              className={clsx(
                "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200",
                "hover:bg-neutral-900/50 hover:border-neutral-600",
                isSelected
                  ? "border-[var(--accent)]/60 bg-[var(--accent)]/10 shadow-lg shadow-[var(--accent)]/10"
                  : "border-neutral-800 bg-neutral-950/50"
              )}
            >
              <input
                type="radio"
                name={`stamp-${productId}`}
                className="sr-only"
                checked={isSelected}
                onChange={() => handleOptionSelect(option)}
                aria-label={option.label}
              />

              <div className="flex items-center justify-center w-8 h-8 bg-neutral-800/50 rounded-full text-sm">
                {getPlacementIcon(option.placement)}
              </div>

              <div className="flex-1">
                <span className="text-sm font-medium text-neutral-100 block">
                  {getPlacementText(option.placement)}
                </span>
                <span className="text-xs text-neutral-400 block mt-1">
                  {option.size
                    .replace("hasta_", "Hasta ")
                    .replace("cm", " cm")
                    .replace("x", " × ")}
                </span>
                <span className="text-xs text-neutral-500 block">
                  {option.placement === "front_back"
                    ? "Personalización en ambos lados"
                    : option.placement === "front"
                    ? "Personalización solo adelante"
                    : "Personalización solo atrás"}
                </span>
              </div>

              {option.extraCost > 0 ? (
                <div className="text-right">
                  <span className="text-sm font-semibold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                    +${option.extraCost}
                  </span>
                  <span className="text-xs text-neutral-500 block mt-1">
                    Costo extra
                  </span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-sm text-neutral-400 bg-neutral-800/50 px-3 py-1 rounded-full">
                    Gratis
                  </span>
                  <span className="text-xs text-neutral-500 block mt-1">
                    Sin costo
                  </span>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default StampSelector;
