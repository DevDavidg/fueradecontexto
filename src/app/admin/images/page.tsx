"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Search,
  Filter,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

interface ProductImage {
  id: string;
  product_id: string;
  color: string;
  url: string;
  created_at: string;
  product?: {
    nombre: string;
  };
}

const ImagesManagement = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .select(
          `
          *,
          product:products(nombre)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setImages(data || []);

      // Extract unique colors
      const uniqueColors = [...new Set(data?.map((img) => img.color) || [])];
      setColors(uniqueColors);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      setImages(images.filter((img) => img.id !== imageId));
      alert("Imagen eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error al eliminar la imagen");
    }
  };

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.product?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = !selectedColor || image.color === selectedColor;
    return matchesSearch && matchesColor;
  });

  if (loading) {
    return (
      <ProfileAdminGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-neutral-400 hover:text-[#ededed]"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-[#ededed]">
                    Gestión de Imágenes
                  </h1>
                  <p className="text-neutral-400 mt-1">
                    Administra las imágenes de los productos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por producto o color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#ededed] placeholder-neutral-400"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#333333] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Todos los colores</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center text-sm text-neutral-400">
                <ImageIcon className="h-4 w-4 mr-2" />
                {filteredImages.length} imágenes encontradas
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image.url}
                        alt={`${image.product?.nombre} - ${image.color}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        width={300}
                        height={300}
                        unoptimized
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-200"
                        title="Eliminar imagen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="mt-2">
                      <p className="text-sm font-medium text-[#ededed] truncate">
                        {image.product?.nombre}
                      </p>
                      <p className="text-xs text-neutral-400">{image.color}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-[#ededed]">
                  No hay imágenes
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {searchTerm || selectedColor
                    ? "No se encontraron imágenes con los filtros aplicados."
                    : "No hay imágenes cargadas en el sistema."}
                </p>
                {!searchTerm && !selectedColor && (
                  <div className="mt-6">
                    <Link
                      href="/admin/products/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Agregar Producto con Imágenes
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

export default ImagesManagement;
