"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { type StampOption } from "@/lib/types";
import { formatCurrency } from "@/lib/format-currency";

type StampBadgeProps = {
  stampOptions: StampOption[];
  selectedStamp: StampOption | null;
  onStampSelect: (stamp: StampOption | null) => void;
  className?: string;
  currency?: string;
};

export const StampBadge: React.FC<StampBadgeProps> = ({
  stampOptions,
  selectedStamp,
  onStampSelect,
  className,
  currency = "ARS",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Calcular posición del dropdown
  React.useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4, // Solo usamos bottom del viewport + gap
          left: rect.left, // Solo usamos left del viewport
          width: rect.width,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      // Actualizar posición en scroll y resize
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Cerrar dropdown al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!stampOptions || stampOptions.length === 0) {
    return null;
  }

  const handleSelect = (option: StampOption | null) => {
    onStampSelect(option);
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={clsx("space-y-2", className)}>
      <div className="flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 text-pink-500"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-xs font-medium text-neutral-300">
          Personalización
        </span>
      </div>

      {/* Custom Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={clsx(
          "w-full px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-200",
          "border-2 cursor-pointer flex items-center justify-between",
          "bg-neutral-900/50 hover:bg-neutral-900/70",
          "focus:outline-none focus:ring-2 focus:ring-pink-500/30",
          selectedStamp
            ? "border-pink-500 text-pink-400"
            : "border-neutral-700 text-neutral-300 hover:border-neutral-600"
        )}
      >
        <span className="truncate">
          {selectedStamp ? selectedStamp.label : "Sin personalización"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={clsx(
            "w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-1",
            isOpen ? "rotate-180" : ""
          )}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu - Portal fuera de la card */}
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className={clsx(
              "fixed z-[9999]",
              "bg-neutral-900 border-2 border-neutral-700 rounded-lg shadow-2xl",
              "max-h-64 overflow-y-auto",
              "animate-in fade-in slide-in-from-top-2 duration-200"
            )}
            style={{
              top: `${dropdownPosition.top + 4}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Opción para deseleccionar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(null);
              }}
              className={clsx(
                "w-full px-3 py-2.5 text-left text-xs transition-colors",
                "hover:bg-neutral-800 border-b border-neutral-800",
                !selectedStamp
                  ? "bg-pink-500/10 text-pink-400 font-medium"
                  : "text-neutral-400"
              )}
            >
              <div className="flex items-center justify-between">
                <span>Sin personalización</span>
                {!selectedStamp && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 text-pink-500"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </button>

            {/* Opciones de estampado */}
            {stampOptions.map((option) => {
              const isSelected = selectedStamp?.id === option.id;
              const isFree = option.extraCost === 0;

              return (
                <button
                  key={option.id || `${option.placement}-${option.size}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  className={clsx(
                    "w-full px-3 py-2.5 text-left text-xs transition-colors",
                    "hover:bg-neutral-800 border-b border-neutral-800 last:border-b-0",
                    isSelected
                      ? "bg-pink-500/10 text-pink-400"
                      : "text-neutral-300"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1 font-medium">{option.label}</span>
                    <div className="flex items-center gap-2">
                      {isFree ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-semibold">
                          Incluido
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-pink-400">
                          +{formatCurrency(option.extraCost, currency)}
                        </span>
                      )}
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3 text-pink-500 flex-shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>,
          document.body
        )}

      {/* Indicador de costo adicional */}
      {selectedStamp && selectedStamp.extraCost > 0 && (
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-neutral-400">Adicional:</span>
          <span className="font-semibold text-pink-400">
            +{formatCurrency(selectedStamp.extraCost, currency)}
          </span>
        </div>
      )}
    </div>
  );
};

export default StampBadge;
