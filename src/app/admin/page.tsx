"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import Link from "next/link";
import {
  Package,
  Image,
  Palette,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Plus,
  Receipt,
  RefreshCw,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { useAdminStats } from "@/hooks/use-admin-stats";

const formatPeso = (amount: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
};

const AdminDashboard = () => {
  const { stats, loading, error, refreshStats } = useAdminStats();

  const adminMenuItems = [
    {
      title: "Gestión de Productos",
      description: "Agregar, editar y eliminar productos",
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500",
    },
    {
      title: "Gestión de Imágenes",
      description: "Subir y organizar imágenes de productos",
      icon: Image,
      href: "/admin/images",
      color: "bg-green-500",
    },
    {
      title: "Editor de Sections",
      description: "Editar contenido de secciones del sitio",
      icon: Palette,
      href: "/admin/sections",
      color: "bg-purple-500",
    },
    {
      title: "Precios de Estampas",
      description: "Gestionar precios de opciones de estampas",
      icon: Receipt,
      href: "/admin/stamp-pricing",
      color: "bg-orange-500",
    },
    {
      title: "Usuarios",
      description: "Gestionar usuarios y roles",
      icon: Users,
      color: "bg-indigo-500",
      href: "/admin/users",
    },
    {
      title: "Configuración",
      description: "Configuración general del sistema",
      icon: Settings,
      color: "bg-gray-500",
      href: "/admin/settings",
    },
  ];

  return (
    <ProfileAdminGuard>
      <div className="min-h-screen bg-black text-[#ededed]">
        {/* Header */}
        <div className="bg-[#0b0b0b] border-b border-[#333333]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-[#ededed]">
                  Panel de Administración
                </h1>
                <p className="text-neutral-400 mt-1">
                  Bienvenido al panel de administración
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={refreshStats}
                  disabled={loading}
                  className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-700 flex items-center space-x-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Actualizar</span>
                </button>
                <Link
                  href="/admin/products/new"
                  className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nuevo Producto</span>
                </Link>
                <Link
                  href="/"
                  className="text-neutral-400 hover:text-[#ededed] transition-colors"
                >
                  Ver Tienda
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Package className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">
                    Total Productos
                  </p>
                  <div className="text-2xl font-semibold text-[#ededed]">
                    {loading ? (
                      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : error ? (
                      "Error"
                    ) : (
                      stats?.overview.totalProducts || 0
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">
                    Usuarios
                  </p>
                  <div className="text-2xl font-semibold text-[#ededed]">
                    {loading ? (
                      <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : error ? (
                      "Error"
                    ) : (
                      stats?.overview.totalUsers || 0
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">
                    Valor Inventario
                  </p>
                  <div className="text-2xl font-semibold text-[#ededed]">
                    {loading ? (
                      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : error ? (
                      "Error"
                    ) : (
                      formatPeso(stats?.overview.totalInventoryValue || 0)
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">
                    Unidades en Stock
                  </p>
                  <div className="text-2xl font-semibold text-[#ededed]">
                    {loading ? (
                      <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : error ? (
                      "Error"
                    ) : (
                      stats?.overview.productsInStock || 0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          {stats && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Productos por Categoría */}
              <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#ededed] mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                  Productos por Categoría
                </h3>
                <div className="space-y-3">
                  {stats.categoryDistribution.slice(0, 5).map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-neutral-300">
                        {category.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-neutral-700 rounded-full h-2">
                          <div
                            className="bg-blue-400 h-2 rounded-full"
                            style={{
                              width: `${
                                (category.count /
                                  stats.overview.totalProducts) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-[#ededed] w-8 text-right">
                          {category.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de Actividad */}
              <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#ededed] mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Actividad del Mes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-sm text-neutral-300">
                        Nuevos Productos
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-blue-400">
                      +{stats.overview.productsThisMonth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-sm text-neutral-300">
                        Nuevos Usuarios
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-green-400">
                      +{stats.overview.usersThisMonth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 text-purple-400 mr-2" />
                      <span className="text-sm text-neutral-300">
                        Productos Sin Stock
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-red-400">
                      {stats.overview.productsOutOfStock}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-400">
                    Error al cargar estadísticas
                  </h3>
                  <p className="text-sm text-red-300 mt-1">{error}</p>
                  <button
                    onClick={refreshStats}
                    className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-[#0b0b0b] border border-[#333333] rounded-lg hover:border-[#555555] transition-all duration-200 p-6 group"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#ededed] group-hover:text-[var(--accent)] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-neutral-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default AdminDashboard;
