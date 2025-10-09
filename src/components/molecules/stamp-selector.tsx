"use client";

import * as React from "react";
import { clsx } from "clsx";
import { type StampOption, type PrintPlacement } from "@/lib/types";
import { formatCurrency } from "@/lib/format-currency";

type StampSelectorProps = {
  stampOptions: StampOption[];
  selectedOption: StampOption | null;
  onSelectOption: (option: StampOption | null) => void;
  currency?: string;
  className?: string;
};

const PLACEMENT_LABELS: Record<PrintPlacement, string> = {
  front: "Adelante",
  back: "Atrás",
  front_back: "Adelante + Atrás",
};

const PLACEMENT_ICONS: Record<PrintPlacement, React.ReactNode> = {
  front: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M8 12H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h3" />
      <path d="M16 12h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3" />
      <path d="M8 19v3" />
      <path d="M16 19v3" />
    </svg>
  ),
  back: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
      <path d="M8 12H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h3" />
      <path d="M16 12h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3" />
      <path d="M8 19v3" />
      <path d="M16 19v3" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  front_back: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M8 12H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h3" />
      <path d="M16 12h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3" />
      <path d="M8 19v3" />
      <path d="M16 19v3" />
      <path d="M9 7h6" />
      <path d="M9 10h6" />
    </svg>
  ),
};

export const StampSelector: React.FC<StampSelectorProps> = ({
  stampOptions,
  selectedOption,
  onSelectOption,
  currency = "ARS",
  className,
}) => {
  // Group options by placement
  const groupedOptions = React.useMemo(() => {
    const groups: Record<PrintPlacement, StampOption[]> = {
      front: [],
      back: [],
      front_back: [],
    };

    stampOptions.forEach((option) => {
      groups[option.placement].push(option);
    });

    return groups;
  }, [stampOptions]);

  if (!stampOptions || stampOptions.length === 0) {
    return null;
  }

  return (
    <div className={clsx("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-pink-500"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h.01" />
            <path d="M17 7h.01" />
            <path d="M7 17h.01" />
            <path d="M17 17h.01" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Opciones de Estampado
        </h3>
        <p className="text-xs text-neutral-400">
          Selecciona ubicación y tamaño de tu estampa personalizada
        </p>
      </div>

      <div className="space-y-4">
        {(Object.keys(groupedOptions) as PrintPlacement[]).map((placement) => {
          const options = groupedOptions[placement];
          if (options.length === 0) return null;

          return (
            <div key={placement} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                {PLACEMENT_ICONS[placement]}
                <span>{PLACEMENT_LABELS[placement]}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((option) => {
                  const isSelected = selectedOption?.id === option.id;
                  const isFree = option.extraCost === 0;

                  return (
                    <button
                      key={option.id || `${option.placement}-${option.size}`}
                      onClick={() => {
                        // Toggle: si ya está seleccionado, deseleccionar
                        if (isSelected) {
                          onSelectOption(null);
                        } else {
                          onSelectOption(option);
                        }
                      }}
                      className={clsx(
                        "relative flex flex-col items-start gap-1 p-3 rounded-lg border-2 transition-all duration-200",
                        "hover:scale-[1.02] active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50",
                        isSelected
                          ? "border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20"
                          : "border-neutral-700 bg-neutral-900/50 hover:border-neutral-600 hover:bg-neutral-900/70"
                      )}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-3 h-3 text-white"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Option label */}
                      <div className="flex flex-col gap-1 flex-1 pr-6">
                        <span
                          className={clsx(
                            "text-sm font-medium",
                            isSelected ? "text-pink-400" : "text-white"
                          )}
                        >
                          {option.label}
                        </span>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          {isFree ? (
                            <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                              Incluido
                            </span>
                          ) : (
                            <span
                              className={clsx(
                                "text-sm font-semibold",
                                isSelected
                                  ? "text-pink-300"
                                  : "text-neutral-300"
                              )}
                            >
                              + {formatCurrency(option.extraCost, currency)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {selectedOption && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-300">Estampado seleccionado:</span>
            <span className="font-semibold text-pink-400">
              {selectedOption.label}
            </span>
          </div>
          {selectedOption.extraCost > 0 && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-neutral-400">Costo adicional:</span>
              <span className="font-semibold text-white">
                + {formatCurrency(selectedOption.extraCost, currency)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StampSelector;
