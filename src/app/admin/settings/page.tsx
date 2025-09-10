"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Database,
  Image,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalImages: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsResult, usersResult, imagesResult, categoriesResult] =
        await Promise.all([
          supabase
            .from("products")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("product_images")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("categories")
            .select("id", { count: "exact", head: true }),
        ]);

      setStats({
        totalProducts: productsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalImages: imagesResult.count || 0,
        totalCategories: categoriesResult.count || 0,
      });
    } catch (error) {
      // Error fetching stats
    }
  };

  const handleSeedProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seed-products", {
        method: "POST",
      });

      if (response.ok) {
        alert("Productos cargados exitosamente");
        fetchStats();
      } else {
        throw new Error("Error al cargar productos");
      }
    } catch (error) {
      alert("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seed-admin", {
        method: "POST",
      });

      if (response.ok) {
        alert("Usuario admin creado exitosamente");
        fetchStats();
      } else {
        throw new Error("Error al crear usuario admin");
      }
    } catch (error) {
      alert("Error al crear el usuario admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileAdminGuard>
      <div className="min-h-screen bg-black text-[#ededed]">
        {/* Header */}
        <div className="bg-[#0b0b0b] border border-[#333333] shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-neutral-400 hover:text-[#ededed]"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-[#ededed]">
                    Configuración del Sistema
                  </h1>
                  <p className="text-neutral-400 mt-1">
                    Administra la configuración general del sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">
                    Total Productos
                  </p>
                  <p className="text-2xl font-semibold text-[#ededed]">
                    {stats.totalProducts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">
                    Total Usuarios
                  </p>
                  <p className="text-2xl font-semibold text-[#ededed]">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Image className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">
                    Total Imágenes
                  </p>
                  <p className="text-2xl font-semibold text-[#ededed]">
                    {stats.totalImages}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <SettingsIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">
                    Categorías
                  </p>
                  <p className="text-2xl font-semibold text-[#ededed]">
                    {stats.totalCategories}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Sections */}
          <div className="space-y-6">
            {/* Database Setup */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-4">
                Configuración de Base de Datos
              </h2>
              <p className="text-neutral-400 mb-6">
                Herramientas para configurar y poblar la base de datos con datos
                iniciales.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleSeedProducts}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {loading ? "Cargando..." : "Cargar Productos de Ejemplo"}
                </button>

                <button
                  onClick={handleSeedAdmin}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {loading ? "Creando..." : "Crear Usuario Admin"}
                </button>
              </div>
            </div>

            {/* Storage Setup */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-4">
                Configuración de Almacenamiento
              </h2>
              <p className="text-neutral-400 mb-4">
                Configuración para el almacenamiento de imágenes de productos.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SettingsIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Configuración Requerida
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Para que el sistema de carga de imágenes funcione
                        correctamente, necesitas ejecutar el siguiente script
                        SQL en tu panel de Supabase:
                      </p>
                      <div className="mt-2">
                        <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                          scripts/setup-storage.sql
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-4">
                Información del Sistema
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-[#ededed] mb-2">
                    Versión
                  </h3>
                  <p className="text-neutral-400">1.0.0</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#ededed] mb-2">
                    Base de Datos
                  </h3>
                  <p className="text-neutral-400">Supabase PostgreSQL</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#ededed] mb-2">
                    Almacenamiento
                  </h3>
                  <p className="text-neutral-400">Supabase Storage</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#ededed] mb-2">
                    Framework
                  </h3>
                  <p className="text-neutral-400">Next.js 14</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default AdminSettings;
