"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useState, useEffect, useCallback } from "react";
import { useLogger } from "@/hooks/use-logger";
import {
  Edit,
  X,
  Plus,
  DollarSign,
  Stamp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
} from "lucide-react";
import {
  Skeleton,
  SkeletonFormSection,
} from "@/components/molecules/skeleton-loading";

interface PrintSize {
  id: string;
  size_key: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

interface StampOption {
  id: string;
  placement: string;
  size_id: string;
  label: string;
  extra_cost: number;
  created_at?: string;
  updated_at?: string;
}

const StampPricingAdmin = () => {
  const logger = useLogger();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [printSizes, setPrintSizes] = useState<PrintSize[]>([]);
  const [stampOptions, setStampOptions] = useState<StampOption[]>([]);
  const [editingPrintSize, setEditingPrintSize] = useState<string | null>(null);
  const [editingStampOption, setEditingStampOption] = useState<string | null>(
    null
  );
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupMessage, setSetupMessage] = useState("");

  const sizeLabels: Record<string, string> = {
    hasta_15cm: "Hasta 15cm",
    hasta_20x30cm: "Hasta 20x30cm",
    hasta_30x40cm: "Hasta 30x40cm",
    hasta_40x50cm: "Hasta 40x50cm",
  };

  const placementLabels: Record<string, string> = {
    front: "Solo adelante",
    back: "Solo atrás",
    front_back: "Adelante + Atrás",
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/stamp-pricing");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al cargar los datos");
      }

      setPrintSizes(result.data.printSizes);
      setStampOptions(result.data.stampOptions);
      setNeedsSetup(result.needsSetup || false);
      setSetupMessage(result.message || "");
    } catch (error) {
      logger.error("Error fetching stamp pricing data", error, {
        component: "StampPricingAdmin",
        action: "fetchData",
      });
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [logger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updatePrintSizePrice = async (id: string, newPrice: number) => {
    try {
      setSaving(true);

      const response = await fetch("/api/stamp-pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "print_size",
          id,
          price: newPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar el precio");
      }

      if (result.warning) {
        alert(result.message);
      } else {
        setPrintSizes((prev) =>
          prev.map((size) =>
            size.id === id ? { ...size, price: newPrice } : size
          )
        );

        setEditingPrintSize(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      logger.error("Error updating print size price", error, {
        component: "StampPricingAdmin",
        action: "updatePrintSizePrice",
        metadata: { sizeId: id, newPrice },
      });
      alert(
        error instanceof Error ? error.message : "Error al actualizar el precio"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateStampOptionPrice = async (id: string, newPrice: number) => {
    try {
      setSaving(true);

      const response = await fetch("/api/stamp-pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "stamp_option",
          id,
          price: newPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar el precio");
      }

      if (result.warning) {
        alert(result.message);
      } else {
        setStampOptions((prev) =>
          prev.map((option) =>
            option.id === id ? { ...option, extra_cost: newPrice } : option
          )
        );

        setEditingStampOption(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      logger.error("Error updating stamp option price", error, {
        component: "StampPricingAdmin",
        action: "updateStampOptionPrice",
        metadata: { optionId: id, newPrice },
      });
      alert(
        error instanceof Error ? error.message : "Error al actualizar el precio"
      );
    } finally {
      setSaving(false);
    }
  };

  const validatePrice = (price: number): string | null => {
    if (price < 0) return "El precio no puede ser negativo";
    if (price > 100000) return "El precio no puede ser mayor a $100,000";
    return null;
  };

  const setupSystem = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/stamp-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al configurar el sistema");
      }

      if (result.warning) {
        alert(result.message);
      } else {
        setSaveSuccess(true);
        setNeedsSetup(false);
        setSetupMessage("");

        // Reload data after setup
        await fetchData();

        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      logger.error("Error setting up stamp pricing system", error, {
        component: "StampPricingAdmin",
        action: "setupSystem",
      });
      alert(
        error instanceof Error
          ? error.message
          : "Error al configurar el sistema"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProfileAdminGuard>
        <div className="min-h-screen bg-black text-[#ededed]">
          {/* Header Skeleton */}
          <div className="bg-[#0b0b0b] border border-[#333333] shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-48" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <SkeletonFormSection />
            <SkeletonFormSection />
          </div>
        </div>
      </ProfileAdminGuard>
    );
  }

  return (
    <ProfileAdminGuard>
      <div className="min-h-screen bg-black text-[#ededed]">
        {/* Header */}
        <div className="bg-[#0b0b0b] border border-[#333333] shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-3">
                <Stamp className="h-8 w-8 text-[var(--accent)]" />
                <div>
                  <h1 className="text-3xl font-bold text-[#ededed]">
                    Gestión de Precios de Estampas
                  </h1>
                  <p className="text-neutral-400 mt-1">
                    Configura los precios base y adicionales para las opciones
                    de estampas
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {saveSuccess && (
                <div className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>¡Precios actualizados exitosamente!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Setup Required Message */}
          {needsSetup && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-yellow-400">
                  Configuración Requerida
                </h3>
              </div>
              <p className="text-yellow-300 mb-4">{setupMessage}</p>
              <div className="bg-yellow-800/20 border border-yellow-600/30 rounded p-3 mb-4">
                <p className="text-yellow-200 text-sm">
                  <strong>Nota:</strong> Los precios mostrados son datos de
                  respaldo. Para configurar las tablas en la base de datos,
                  ejecuta el script SQL
                  <code className="bg-yellow-900/50 px-2 py-1 rounded text-xs ml-1">
                    scripts/setup-stamp-pricing-system.sql
                  </code>
                  en la consola de Supabase.
                </p>
              </div>
              <button
                onClick={setupSystem}
                disabled={saving}
                className="bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Configurando...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Configurar Sistema de Precios</span>
                  </>
                )}
              </button>
            </div>
          )}
          {/* Print Sizes Section */}
          {!needsSetup && (
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="h-6 w-6 text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Precios Base por Tamaño
                </h2>
              </div>

              <div className="mb-4 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">
                    Precios Base
                  </span>
                </div>
                <p className="text-xs text-blue-300">
                  Estos son los precios base para cada tamaño de estampa. Se
                  aplican automáticamente a todas las opciones de estampas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {printSizes.map((size) => (
                  <div
                    key={size.id}
                    className="flex items-center justify-between p-4 border border-[#333333] rounded-lg hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-[#ededed]">
                        {sizeLabels[size.size_key] || size.size_key}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        Tamaño: {size.size_key}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {editingPrintSize === size.id ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">
                              $
                            </span>
                            <input
                              type="number"
                              defaultValue={size.price}
                              min="0"
                              max="100000"
                              disabled={saving}
                              className="w-24 pl-8 pr-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors disabled:opacity-50"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !saving) {
                                  const newPrice = parseInt(
                                    (e.target as HTMLInputElement).value
                                  );
                                  const error = validatePrice(newPrice);
                                  if (error) {
                                    alert(error);
                                    return;
                                  }
                                  updatePrintSizePrice(size.id, newPrice);
                                } else if (e.key === "Escape") {
                                  setEditingPrintSize(null);
                                }
                              }}
                              onBlur={(e) => {
                                if (!saving) {
                                  const newPrice = parseInt(e.target.value);
                                  const error = validatePrice(newPrice);
                                  if (error) {
                                    alert(error);
                                    return;
                                  }
                                  updatePrintSizePrice(size.id, newPrice);
                                }
                              }}
                              autoFocus
                            />
                          </div>
                          <button
                            onClick={() => setEditingPrintSize(null)}
                            disabled={saving}
                            className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-400">
                            ${size.price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => setEditingPrintSize(size.id)}
                            className="text-[var(--accent)] hover:text-[var(--accent-hover)] p-1"
                            title="Editar precio"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stamp Options Section */}
          {!needsSetup && (
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <Stamp className="h-6 w-6 text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Opciones de Estampas
                </h2>
              </div>

              <div className="mb-4 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">
                    Costos Adicionales
                  </span>
                </div>
                <p className="text-xs text-blue-300">
                  Estos son los costos adicionales que se suman al precio base
                  según la ubicación y tamaño de la estampa.
                </p>
              </div>

              <div className="space-y-4">
                {stampOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between p-4 border border-[#333333] rounded-lg hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-[#ededed]">
                        {option.label}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-neutral-400">
                          {placementLabels[option.placement]}
                        </span>
                        <span className="text-sm text-neutral-400">
                          Tamaño: {sizeLabels[option.size_id] || option.size_id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {editingStampOption === option.id ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">
                              $
                            </span>
                            <input
                              type="number"
                              defaultValue={option.extra_cost}
                              min="0"
                              max="100000"
                              disabled={saving}
                              className="w-24 pl-8 pr-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors disabled:opacity-50"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !saving) {
                                  const newPrice = parseInt(
                                    (e.target as HTMLInputElement).value
                                  );
                                  const error = validatePrice(newPrice);
                                  if (error) {
                                    alert(error);
                                    return;
                                  }
                                  updateStampOptionPrice(option.id, newPrice);
                                } else if (e.key === "Escape") {
                                  setEditingStampOption(null);
                                }
                              }}
                              onBlur={(e) => {
                                if (!saving) {
                                  const newPrice = parseInt(e.target.value);
                                  const error = validatePrice(newPrice);
                                  if (error) {
                                    alert(error);
                                    return;
                                  }
                                  updateStampOptionPrice(option.id, newPrice);
                                }
                              }}
                              autoFocus
                            />
                          </div>
                          <button
                            onClick={() => setEditingStampOption(null)}
                            disabled={saving}
                            className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-bold ${
                              option.extra_cost > 0
                                ? "text-green-400"
                                : "text-blue-400"
                            }`}
                          >
                            {option.extra_cost > 0
                              ? `+$${option.extra_cost.toLocaleString()}`
                              : "Sin costo adicional"}
                          </span>
                          <button
                            onClick={() => setEditingStampOption(option.id)}
                            className="text-[var(--accent)] hover:text-[var(--accent-hover)] p-1"
                            title="Editar precio"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default StampPricingAdmin;
