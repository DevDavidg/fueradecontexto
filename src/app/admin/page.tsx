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
} from "lucide-react";

const AdminDashboard = () => {
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
                <Link
                  href="/admin/products/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
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
                  <p className="text-2xl font-semibold text-[#ededed]">-</p>
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
                  <p className="text-2xl font-semibold text-[#ededed]">-</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-400">Ventas</p>
                  <p className="text-2xl font-semibold text-[#ededed]">-</p>
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
                    Órdenes
                  </p>
                  <p className="text-2xl font-semibold text-[#ededed]">-</p>
                </div>
              </div>
            </div>
          </div>

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
                      <h3 className="text-lg font-semibold text-[#ededed] group-hover:text-blue-400 transition-colors">
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
