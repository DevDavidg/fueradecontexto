"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Search, Filter, Package } from "lucide-react";

interface Product {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio_normal: number;
  precio_transferencia: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      // Error fetching products
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      // Error fetching categories
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.filter((p) => p.id !== productId));
      alert("Producto eliminado exitosamente");
    } catch (error) {
      alert("Error al eliminar el producto");
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    // Show confirmation dialog
    const confirmed = confirm(
      `¿Estás seguro de que quieres actualizar el stock a ${newStock} unidades?`
    );

    if (!confirmed) {
      return;
    }

    try {
      // Get the current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
      }

      // Try to test RLS first
      try {
        const testResponse = await fetch("/api/disable-rls", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (testResponse.ok) {
          const testResult = await testResponse.json();
        }
      } catch (testError) {
        // Could not test RLS, proceeding anyway
      }

      const response = await fetch(`/api/products/${productId}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update stock");
      }

      // Update the local state
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );

      alert("Stock actualizado exitosamente");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al actualizar el stock: ${errorMessage}`);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  if (loading) {
    return (
      <ProfileAdminGuard>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ededed]"></div>
        </div>
      </ProfileAdminGuard>
    );
  }

  return (
    <ProfileAdminGuard>
      <div className="min-h-screen bg-black text-[#ededed]">
        {/* Header */}
        <div className="bg-[#0b0b0b] border-b border-[#333333]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-[#ededed]">
                  Gestión de Productos
                </h1>
                <p className="text-neutral-400 mt-1">
                  Administra todos los productos de la tienda
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
                  href="/admin"
                  className="text-neutral-400 hover:text-[#ededed] transition-colors"
                >
                  Volver al Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#ededed] placeholder-neutral-400"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#ededed] appearance-none"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center text-sm text-neutral-400">
                <Package className="h-4 w-4 mr-2" />
                {filteredProducts.length} productos encontrados
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#333333]">
                <thead className="bg-[#1a1a1a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Precio Normal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Precio Transferencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Fecha Creación
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0b0b0b] divide-y divide-[#333333]">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-[#ededed]">
                            {product.nombre}
                          </div>
                          <div className="text-sm text-neutral-400 truncate max-w-xs">
                            {product.descripcion}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400">
                          {categories.find((c) => c.id === product.categoria)
                            ?.name || product.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#ededed]">
                        {formatPrice(product.precio_normal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#ededed]">
                        {formatPrice(product.precio_transferencia)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            defaultValue={product.stock || 0}
                            onBlur={(e) => {
                              const newStock = parseInt(e.target.value) || 0;
                              if (newStock !== (product.stock || 0)) {
                                updateStock(product.id, newStock);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const newStock =
                                  parseInt(e.currentTarget.value) || 0;
                                if (newStock !== (product.stock || 0)) {
                                  updateStock(product.id, newStock);
                                }
                                e.currentTarget.blur();
                              }
                            }}
                            className="w-20 px-2 py-1 text-sm bg-[#1a1a1a] border border-[#333333] rounded text-[#ededed] focus:border-blue-500 focus:outline-none"
                          />
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              (product.stock || 0) > 0
                                ? "bg-green-600/20 text-green-400"
                                : "bg-red-600/20 text-red-400"
                            }`}
                          >
                            {(product.stock || 0) > 0 ? "En Stock" : "Agotado"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {new Date(product.created_at).toLocaleDateString(
                          "es-AR"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Ver producto"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="Editar producto"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-neutral-400" />
                <h3 className="mt-2 text-sm font-medium text-[#ededed]">
                  No hay productos
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {searchTerm || selectedCategory
                    ? "No se encontraron productos con los filtros aplicados."
                    : "Comienza agregando tu primer producto."}
                </p>
                {!searchTerm && !selectedCategory && (
                  <div className="mt-6">
                    <Link
                      href="/admin/products/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Producto
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default ProductsManagement;
