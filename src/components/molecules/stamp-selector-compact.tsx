"use client";

import * as React from "react";
import { clsx } from "clsx";
import { type StampOption } from "@/lib/types";
import { formatCurrency } from "@/lib/format-currency";

type StampSelectorCompactProps = {
  stampOptions: StampOption[];
  selectedOption: StampOption | null;
  onSelectOption: (option: StampOption) => void;
  currency?: string;
  className?: string;
};

export const StampSelectorCompact: React.FC<StampSelectorCompactProps> = ({
  stampOptions,
  selectedOption,
  onSelectOption,
  currency = "ARS",
  className,
}) => {
  if (!stampOptions || stampOptions.length === 0) {
    return null;
  }

  return (
    <div className={clsx("space-y-2", className)}>
      <label className="text-xs font-medium text-white flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3 h-3 text-pink-500"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Estampado
      </label>

      <select
        value={selectedOption?.id || ""}
        onChange={(e) => {
          const option = stampOptions.find((opt) => opt.id === e.target.value);
          if (option) {
            onSelectOption(option);
          }
        }}
        className={clsx(
          "w-full px-3 py-2 rounded-lg border-2 transition-all duration-200",
          "bg-neutral-900 text-white text-sm",
          "focus:outline-none focus:ring-2 focus:ring-pink-500/50",
          selectedOption
            ? "border-pink-500"
            : "border-neutral-700 hover:border-neutral-600"
        )}
      >
        <option value="">Sin estampado</option>
        {stampOptions.map((option) => {
          const isFree = option.extraCost === 0;
          const priceLabel = isFree
            ? "(Incluido)"
            : `(+ ${formatCurrency(option.extraCost, currency)})`;

          return (
            <option
              key={option.id || `${option.placement}-${option.size}`}
              value={option.id}
            >
              {option.label} {priceLabel}
            </option>
          );
        })}
      </select>

      {selectedOption && selectedOption.extraCost > 0 && (
        <div className="flex items-center justify-between text-xs px-2">
          <span className="text-neutral-400">Costo adicional:</span>
          <span className="font-semibold text-pink-400">
            + {formatCurrency(selectedOption.extraCost, currency)}
          </span>
        </div>
      )}
    </div>
  );
};

export default StampSelectorCompact;
