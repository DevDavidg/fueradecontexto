"use client";

import * as React from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import { type StampOption, type PrintPlacement } from "@/lib/types";

export type StampSelectorProps = {
  selectedOptions?: StampOption[];
  onOptionsChange: (options: StampOption[]) => void;
  productId: string;
  stampOptions?: StampOption[];
  className?: string;
};

const getPlacementIcon = (placement: PrintPlacement) => {
  switch (placement) {
    case "front":
      return "F";
    case "back":
      return "B";
    case "front_back":
      return "FB";
    default:
      return "?";
  }
};

export const StampSelector: React.FC<StampSelectorProps> = ({
  selectedOptions = [],
  onOptionsChange,
  productId,
  stampOptions = [],
  className,
}) => {
  const handleOptionToggle = React.useCallback(
    (option: StampOption) => {
      const isSelected = selectedOptions.some(
        (selected) => selected.id === option.id
      );

      if (isSelected) {
        onOptionsChange(
          selectedOptions.filter((selected) => selected.id !== option.id)
        );
      } else {
        onOptionsChange([...selectedOptions, option]);
      }
    },
    [selectedOptions, onOptionsChange]
  );

  if (!stampOptions || stampOptions.length === 0) {
    return null;
  }

  return (
    <div className={clsx("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 bg-neutral-800 rounded-full text-xs">
          <Check className="w-3 h-3" />
        </div>
        <h3 className="text-sm font-medium text-neutral-200">
          Opciones de personalización
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {stampOptions.map((option, index) => {
          const isSelected = selectedOptions.some(
            (selected) => selected.id === option.id
          );
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
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={() => handleOptionToggle(option)}
                aria-label={option.label}
              />

              <div className="flex items-center justify-center w-8 h-8 bg-neutral-800/50 rounded-full text-sm">
                {isSelected ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs">
                    {getPlacementIcon(option.placement)}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <span className="text-sm font-medium text-neutral-100 block">
                  {option.label}
                </span>
              </div>

              {option.extraCost > 0 ? (
                <span className="text-sm font-semibold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                  +${option.extraCost}
                </span>
              ) : (
                <span className="text-sm text-neutral-400 bg-neutral-800/50 px-3 py-1 rounded-full">
                  Gratis
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default StampSelector;
