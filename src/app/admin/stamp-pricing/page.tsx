"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, DollarSign, Settings } from "lucide-react";

interface PrintSize {
  id: string;
  size_key: string;
  price: number;
  label: string;
}

interface StampOption {
  id: string;
  placement: string;
  size_id: string;
  label: string;
  extra_cost: number;
}

const StampPricingManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [printSizes, setPrintSizes] = useState<PrintSize[]>([]);
  const [stampOptions, setStampOptions] = useState<StampOption[]>([]);
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>(
    {}
  );
  const [setupLoading, setSetupLoading] = useState(false);

  const sizeLabels: Record<string, string> = {
    hasta_15cm: "Hasta 15cm",
    hasta_20x30cm: "Hasta 20x30cm",
    hasta_30x40cm: "Hasta 30x40cm",
    hasta_40x50cm: "Hasta 40x50cm",
  };

  const placementLabels: Record<string, string> = {
    front: "Adelante",
    back: "Atrás",
    front_back: "Adelante + Atrás",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch print sizes
      const { data: printSizesData, error: printSizesError } = await supabase
        .from("print_sizes")
        .select("*")
        .order("price", { ascending: true });

      if (printSizesError) throw printSizesError;

      // Add labels to print sizes
      const printSizesWithLabels = (printSizesData || []).map((size) => ({
        ...size,
        label: sizeLabels[size.size_key] || size.size_key,
      }));

      setPrintSizes(printSizesWithLabels);

      // Fetch stamp options
      const { data: stampOptionsData, error: stampOptionsError } =
        await supabase
          .from("stamp_options")
          .select("*")
          .order("placement", { ascending: true })
          .order("size_id", { ascending: true });

      if (stampOptionsError) throw stampOptionsError;
      setStampOptions(stampOptionsData || []);

      // Initialize editing prices
      const initialPrices: Record<string, number> = {};
      stampOptionsData?.forEach((option) => {
        initialPrices[option.id] = option.extra_cost;
      });
      setEditingPrices(initialPrices);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (optionId: string, price: number) => {
    setEditingPrices((prev) => ({
      ...prev,
      [optionId]: price,
    }));
  };

  const handleSavePrices = async () => {
    try {
      setSaving(true);

      const updates = Object.entries(editingPrices).map(
        ([optionId, price]) => ({
          id: optionId,
          extra_cost: price,
        })
      );

      for (const update of updates) {
        const { error } = await supabase
          .from("stamp_options")
          .update({ extra_cost: update.extra_cost })
          .eq("id", update.id);

        if (error) throw error;
      }

      alert("Precios actualizados correctamente");
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error saving prices:", error);
      alert("Error al guardar los precios");
    } finally {
      setSaving(false);
    }
  };

  const handleSetupTables = async () => {
    try {
      setSetupLoading(true);

      const response = await fetch("/api/setup-stamp-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert("Tablas configuradas correctamente");
        await fetchData(); // Refresh data
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error setting up tables:", error);
      alert("Error al configurar las tablas");
    } finally {
      setSetupLoading(false);
    }
  };

  const getPrintSizeLabel = (sizeId: string) => {
    return sizeLabels[sizeId] || sizeId;
  };

  const getPlacementLabel = (placement: string) => {
    return placementLabels[placement] || placement;
  };

  if (loading) {
    return (
      <ProfileAdminGuard>
        <div className="min-h-screen bg-black text-white p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando precios de estampas...</span>
            </div>
          </div>
        </div>
      </ProfileAdminGuard>
    );
  }

  return (
    <ProfileAdminGuard>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#ededed] flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-[var(--accent)]" />
                Gestión de Precios de Estampas
              </h1>
              <p className="text-neutral-400 mt-2">
                Administra los precios adicionales para las opciones de estampas
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSetupTables}
                disabled={setupLoading}
                variant="outline"
                className="border-[#333333] text-neutral-300 hover:text-white hover:border-neutral-500"
              >
                {setupLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                {setupLoading ? "Configurando..." : "Configurar Tablas"}
              </Button>
              <Button
                onClick={fetchData}
                variant="outline"
                className="border-[#333333] text-neutral-300 hover:text-white hover:border-neutral-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button
                onClick={handleSavePrices}
                disabled={saving}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>

          {/* Print Sizes Reference */}
          <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#ededed] mb-4">
              Tamaños de Estampa Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {printSizes.map((size) => (
                <div
                  key={size.id}
                  className="p-4 bg-neutral-900 rounded-lg border border-[#333333]"
                >
                  <div className="text-sm font-medium text-neutral-300">
                    {size.label}
                  </div>
                  <div className="text-lg font-bold text-[var(--accent)]">
                    ${size.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stamp Options Pricing */}
          <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#ededed] mb-6">
              Precios de Opciones de Estampas
            </h2>

            <div className="space-y-6">
              {/* Group by placement */}
              {["front", "back", "front_back"].map((placement) => {
                const placementOptions = stampOptions.filter(
                  (option) => option.placement === placement
                );

                if (placementOptions.length === 0) return null;

                return (
                  <div
                    key={placement}
                    className="border border-[#333333] rounded-lg p-6"
                  >
                    <h3 className="text-lg font-medium text-[#ededed] mb-4">
                      {getPlacementLabel(placement)}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {placementOptions.map((option) => (
                        <div
                          key={option.id}
                          className="p-4 bg-neutral-900 rounded-lg border border-[#333333]"
                        >
                          <div className="mb-3">
                            <div className="text-sm font-medium text-neutral-300 mb-1">
                              {getPrintSizeLabel(option.size_id)}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {option.label}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400">+$</span>
                            <input
                              type="number"
                              value={editingPrices[option.id] || 0}
                              onChange={(e) =>
                                handlePriceChange(
                                  option.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full px-2 py-1 bg-black border border-[#333333] rounded text-white text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                              min="0"
                              step="50"
                            />
                          </div>

                          <div className="mt-2 text-xs text-neutral-500">
                            Precio actual: +${option.extra_cost}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Button Bottom */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSavePrices}
              disabled={saving}
              size="lg"
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8"
            >
              {saving ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {saving ? "Guardando..." : "Guardar Todos los Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default StampPricingManagement;
