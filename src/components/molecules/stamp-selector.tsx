"use client";

import * as React from "react";
import { clsx } from "clsx";
import { Check, ChevronDown, X } from "lucide-react";
import { type StampOption, type PrintPlacement } from "@/lib/types";

export type StampSelectorProps = {
  selectedOptions?: StampOption[];
  onOptionsChange: (options: StampOption[]) => void;
  productId: string;
  stampOptions?: StampOption[];
  compact?: boolean;
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

// Memoized option component to prevent unnecessary re-renders
const StampOptionItem = React.memo(
  ({
    option,
    isSelected,
    onToggle,
    productId,
    index,
  }: {
    option: StampOption;
    isSelected: boolean;
    onToggle: (option: StampOption) => void;
    productId: string;
    index: number;
  }) => {
    const handleClick = React.useCallback(() => {
      onToggle(option);
    }, [onToggle, option]);

    return (
      <button
        type="button"
        onClick={handleClick}
        className={clsx(
          "w-full px-4 py-3 text-left transition-all duration-150 flex items-center gap-3 rounded-lg border",
          isSelected
            ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30"
            : "text-neutral-200 hover:bg-neutral-800/60 hover:text-neutral-100 border-neutral-700/50"
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 bg-neutral-800/50 rounded-full">
          {isSelected ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="text-sm font-medium">
              {getPlacementIcon(option.placement)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <span className="font-medium block text-sm">{option.label}</span>
          <span className="text-xs text-neutral-400 block mt-1">
            {option.placement === "front_back"
              ? "Personalización en ambos lados"
              : option.placement === "front"
              ? "Solo adelante"
              : "Solo atrás"}
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
      </button>
    );
  }
);

StampOptionItem.displayName = "StampOptionItem";

export const StampSelector: React.FC<StampSelectorProps> = ({
  selectedOptions = [],
  onOptionsChange,
  productId,
  stampOptions = [],
  compact = false,
  className,
}) => {
  // Use ref to avoid re-renders from state changes
  const [isOpen, setIsOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Memoized handlers to prevent re-renders
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

  const handleOpenModal = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close modal when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleCloseModal]);

  // Close modal with Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleCloseModal]);

  // Calculate totals once to avoid recalculation
  const totalCost = React.useMemo(() => {
    return selectedOptions.reduce(
      (total, option) => total + option.extraCost,
      0
    );
  }, [selectedOptions]);

  if (!stampOptions || stampOptions.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={clsx("relative", className)}>
        <button
          type="button"
          onClick={handleOpenModal}
          className={clsx(
            "w-full px-4 py-3 text-left bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-lg text-sm text-neutral-200 transition-all duration-200",
            "hover:border-neutral-600 hover:bg-neutral-800/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]/60"
          )}
          aria-label="Seleccionar opciones de estampa"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-neutral-800 rounded-full text-xs">
                <Check className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-100 font-medium text-sm truncate">
                    {selectedOptions.length > 0
                      ? `${selectedOptions.length} opc.`
                      : "Personalizar"}
                  </span>
                  {selectedOptions.length > 0 && (
                    <span className="text-xs text-green-400 font-medium ml-2 flex-shrink-0">
                      +${totalCost}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          </div>
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
              ref={modalRef}
              className="w-full max-w-md bg-neutral-900 border border-neutral-700/50 rounded-xl shadow-2xl max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-800/50">
                <h3 className="text-lg font-semibold text-neutral-100">
                  Opciones de personalización
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {stampOptions.map((option, index) => {
                    const isSelected = selectedOptions.some(
                      (selected) => selected.id === option.id
                    );
                    return (
                      <StampOptionItem
                        key={`${productId}-stamp-${index}`}
                        option={option}
                        isSelected={isSelected}
                        onToggle={handleOptionToggle}
                        productId={productId}
                        index={index}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-neutral-800/50 bg-neutral-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">
                    {selectedOptions.length} opción
                    {selectedOptions.length !== 1 ? "es" : ""} seleccionada
                    {selectedOptions.length !== 1 ? "s" : ""}
                  </span>
                  {selectedOptions.length > 0 && (
                    <span className="text-sm font-semibold text-green-400">
                      Total: +${totalCost}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Non-compact version (inline)
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
