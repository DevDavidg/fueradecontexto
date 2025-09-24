"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, X, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Color {
  id?: string;
  nombre: string;
  hex: string;
}

interface Size {
  id?: string;
  size: string;
}

interface PrintSize {
  id?: string;
  size_key: string;
  price: number;
  label?: string;
}

interface StampOption {
  id: string;
  placement: string;
  size_id: string;
  label: string;
  extra_cost: number;
}

const NewProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableStampOptions, setAvailableStampOptions] = useState<
    StampOption[]
  >([]);
  // const [uploadingImages] = useState(false); // TODO: Implement image upload functionality

  // Form data
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    precio_normal: "",
    precio_transferencia: "",
    metodos_pago: [] as string[],
    envio_metodo: "",
    envio_codigo_postal: "",
  });

  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [printSizes, setPrintSizes] = useState<PrintSize[]>([]);
  const [dynamicPrintSizes, setDynamicPrintSizes] = useState<PrintSize[]>([]);
  const [selectedStampOptions, setSelectedStampOptions] = useState<string[]>(
    []
  );
  const [images, setImages] = useState<
    { color: string; file: File; preview: string }[]
  >([]);

  const paymentMethods = [
    "Efectivo",
    "Transferencia bancaria",
    "Mercado Pago",
    "Tarjeta de crédito",
    "Tarjeta de débito",
  ];

  const shippingMethods = [
    "Retiro en local",
    "Envío a domicilio",
    "Envío por correo",
    "Envío express",
  ];

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "Único"];

  const sizeLabels: Record<string, string> = {
    hasta_15cm: "Hasta 15cm",
    hasta_20x30cm: "Hasta 20x30cm",
    hasta_30x40cm: "Hasta 30x40cm",
    hasta_40x50cm: "Hasta 40x50cm",
  };

  useEffect(() => {
    fetchCategories();
    fetchStampOptions();
    fetchDynamicPrintSizes();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching categories:", error);
      }
    }
  };

  const fetchStampOptions = async () => {
    try {
      const { data, error } = await supabase
        .from("stamp_options")
        .select("*")
        .order("placement", { ascending: true })
        .order("size_id", { ascending: true });

      if (error) throw error;
      setAvailableStampOptions(data || []);
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching stamp options:", error);
      }
    }
  };

  const fetchDynamicPrintSizes = async () => {
    try {
      const { data, error } = await supabase
        .from("print_sizes")
        .select("*")
        .order("price", { ascending: true });

      if (error) {
        // Log warning in development only
        if (process.env.NODE_ENV === "development") {
          console.warn("Print sizes table not found, using fallback data");
        }
        // Fallback data si la tabla no existe
        const fallbackSizes = [
          {
            id: "1",
            size_key: "hasta_15cm",
            price: 0,
            key: "hasta_15cm",
            label: "Hasta 15cm",
          },
          {
            id: "2",
            size_key: "hasta_20x30cm",
            price: 500,
            key: "hasta_20x30cm",
            label: "Hasta 20x30cm",
          },
          {
            id: "3",
            size_key: "hasta_30x40cm",
            price: 1000,
            key: "hasta_30x40cm",
            label: "Hasta 30x40cm",
          },
          {
            id: "4",
            size_key: "hasta_40x50cm",
            price: 1500,
            key: "hasta_40x50cm",
            label: "Hasta 40x50cm",
          },
        ];
        setDynamicPrintSizes(fallbackSizes);
        return;
      }

      const sizesWithLabels = (data || []).map((size) => ({
        ...size,
        key: size.size_key,
        label: sizeLabels[size.size_key] || size.size_key,
      }));

      setDynamicPrintSizes(sizesWithLabels);
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching print sizes:", error);
      }
      // Fallback data en caso de error
      const fallbackSizes = [
        {
          id: "1",
          size_key: "hasta_15cm",
          price: 0,
          key: "hasta_15cm",
          label: "Hasta 15cm",
        },
        {
          id: "2",
          size_key: "hasta_20x30cm",
          price: 500,
          key: "hasta_20x30cm",
          label: "Hasta 20x30cm",
        },
        {
          id: "3",
          size_key: "hasta_30x40cm",
          price: 1000,
          key: "hasta_30x40cm",
          label: "Hasta 30x40cm",
        },
        {
          id: "4",
          size_key: "hasta_40x50cm",
          price: 1500,
          key: "hasta_40x50cm",
          label: "Hasta 40x50cm",
        },
      ];
      setDynamicPrintSizes(fallbackSizes);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      metodos_pago: checked
        ? [...prev.metodos_pago, method]
        : prev.metodos_pago.filter((m) => m !== method),
    }));
  };

  const addColor = () => {
    setColors((prev) => [...prev, { nombre: "", hex: "#000000" }]);
  };

  const updateColor = (index: number, field: keyof Color, value: string) => {
    setColors((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, [field]: value } : color
      )
    );
  };

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    setSizes((prev) => [...prev, { size: "" }]);
  };

  const updateSize = (index: number, size: string) => {
    setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, size } : s)));
  };

  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const addPrintSize = () => {
    setPrintSizes((prev) => [...prev, { size_key: "", price: 0 }]);
  };

  const updatePrintSize = (
    index: number,
    field: keyof PrintSize,
    value: string | number
  ) => {
    setPrintSizes((prev) =>
      prev.map((ps, i) => (i === index ? { ...ps, [field]: value } : ps))
    );
  };

  const removePrintSize = (index: number) => {
    setPrintSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStampOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedStampOptions([...selectedStampOptions, optionId]);
    } else {
      setSelectedStampOptions(
        selectedStampOptions.filter((id) => id !== optionId)
      );
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    color: string
  ) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setImages((prev) => [...prev, { color, file, preview }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToSupabase = async (productId: string) => {
    const uploadPromises = images.map(async (imageData) => {
      const fileExt = imageData.file.name.split(".").pop();
      const fileName = `${productId}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageData.file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      // Insert image record
      const { error: insertError } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          color: imageData.color,
          url: publicUrl,
        });

      if (insertError) throw insertError;
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.nombre || !formData.categoria || !formData.descripcion) {
        throw new Error("Por favor completa todos los campos obligatorios");
      }

      if (colors.length === 0) {
        throw new Error("Debes agregar al menos un color");
      }

      if (sizes.length === 0) {
        throw new Error("Debes agregar al menos un tamaño");
      }

      // Create product
      const productId = `product_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}`;

      const { error: productError } = await supabase.from("products").insert({
        id: productId,
        nombre: formData.nombre,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        precio_normal: parseInt(formData.precio_normal),
        precio_transferencia: parseInt(formData.precio_transferencia),
        metodos_pago: formData.metodos_pago,
        envio_metodo: formData.envio_metodo,
        envio_codigo_postal: formData.envio_codigo_postal,
      });

      if (productError) throw productError;

      // Insert colors
      if (colors.length > 0) {
        const { error: colorsError } = await supabase
          .from("product_colors")
          .insert(
            colors.map((color) => ({
              product_id: productId,
              nombre: color.nombre,
              hex: color.hex,
            }))
          );

        if (colorsError) throw colorsError;
      }

      // Insert sizes
      if (sizes.length > 0) {
        const { error: sizesError } = await supabase
          .from("product_sizes")
          .insert(
            sizes.map((size) => ({
              product_id: productId,
              size: size.size,
            }))
          );

        if (sizesError) throw sizesError;
      }

      // Insert print sizes
      if (printSizes.length > 0) {
        const { error: printSizesError } = await supabase
          .from("product_print_sizes")
          .insert(
            printSizes.map((ps) => ({
              product_id: productId,
              size_key: ps.size_key,
              price: ps.price,
            }))
          );

        if (printSizesError) throw printSizesError;
      }

      // Insert stamp options
      if (selectedStampOptions.length > 0) {
        const { error: stampOptionsError } = await supabase
          .from("product_stamp_options")
          .insert(
            selectedStampOptions.map((stampOptionId) => ({
              product_id: productId,
              stamp_option_id: stampOptionId,
            }))
          );

        if (stampOptionsError) throw stampOptionsError;
      }

      // Upload images
      if (images.length > 0) {
        await uploadImagesToSupabase(productId);
      }

      alert("Producto creado exitosamente");
      router.push("/admin/products");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Error al crear el producto"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileAdminGuard>
      <div className="min-h-screen bg-black text-[#ededed]">
        {/* Header */}
        <div className="bg-[#0b0b0b] border-b border-[#333333]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/products"
                  className="text-neutral-400 hover:text-[#ededed] transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-[#ededed]">
                    Nuevo Producto
                  </h1>
                  <p className="text-neutral-400 mt-1">
                    Agrega un nuevo producto a la tienda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-6">
                Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-6">
                Precios
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Precio Normal (ARS)
                  </label>
                  <input
                    type="number"
                    name="precio_normal"
                    value={formData.precio_normal}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Precio Transferencia (ARS)
                  </label>
                  <input
                    type="number"
                    name="precio_transferencia"
                    value={formData.precio_transferencia}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Colores Disponibles
                </h2>
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Color</span>
                </button>
              </div>

              <div className="space-y-4">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md"
                  >
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) =>
                        updateColor(index, "hex", e.target.value)
                      }
                      className="w-12 h-12 border border-[#333333] rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Nombre del color"
                      value={color.nombre}
                      onChange={(e) =>
                        updateColor(index, "nombre", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] placeholder-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Tamaños Disponibles
                </h2>
                <button
                  type="button"
                  onClick={addSize}
                  className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Tamaño</span>
                </button>
              </div>

              <div className="space-y-4">
                {sizes.map((size, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md"
                  >
                    <select
                      value={size.size}
                      onChange={(e) => updateSize(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] placeholder-neutral-400"
                    >
                      <option value="">Selecciona un tamaño</option>
                      {availableSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Print Sizes */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Tamaños de Estampa
                </h2>
                <button
                  type="button"
                  onClick={addPrintSize}
                  className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Tamaño</span>
                </button>
              </div>

              <div className="space-y-4">
                {printSizes.map((printSize, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md"
                  >
                    <select
                      value={printSize.size_key}
                      onChange={(e) =>
                        updatePrintSize(index, "size_key", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] placeholder-neutral-400"
                    >
                      <option value="">Selecciona un tamaño</option>
                      {dynamicPrintSizes.map((option) => (
                        <option key={option.size_key} value={option.size_key}>
                          {option.label} - ${option.price}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Precio extra"
                      value={printSize.price}
                      onChange={(e) =>
                        updatePrintSize(
                          index,
                          "price",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      className="w-32 px-3 py-2 border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removePrintSize(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stamp Options */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-6">
                Opciones de Estampas Disponibles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableStampOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-3 p-3 border border-[#333333] rounded-md hover:border-[#444444] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStampOptions.includes(option.id)}
                      onChange={(e) =>
                        handleStampOptionChange(option.id, e.target.checked)
                      }
                      className="rounded border-[#333333] text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-neutral-200">
                        {option.label}
                      </span>
                      {option.extra_cost > 0 && (
                        <span className="text-xs text-neutral-400 block">
                          +${option.extra_cost}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {selectedStampOptions.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-neutral-400 text-sm">
                    No se han seleccionado opciones de estampas
                  </p>
                  <p className="text-neutral-500 text-xs mt-1">
                    Selecciona al menos una opción para que aparezcan en el
                    producto
                  </p>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-6">
                Métodos de Pago
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.metodos_pago.includes(method)}
                      onChange={(e) =>
                        handlePaymentMethodChange(method, e.target.checked)
                      }
                      className="rounded border-[#333333] text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <span className="text-sm text-[#ededed]">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-6">
                Envío
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Método de Envío
                  </label>
                  <select
                    name="envio_metodo"
                    value={formData.envio_metodo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                  >
                    <option value="">Selecciona un método</option>
                    {shippingMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="envio_codigo_postal"
                    value={formData.envio_codigo_postal}
                    onChange={handleInputChange}
                    placeholder="Ej: 1000"
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                  />
                </div>
              </div>
            </div>

            {/* Stamp Options */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-6">
                Opciones de Estampas
              </h2>
              <p className="text-sm text-neutral-400 mb-4">
                Selecciona qué opciones de estampas estarán disponibles para
                este producto
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableStampOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-3 p-4 border border-[#333333] rounded-lg cursor-pointer hover:bg-neutral-900/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStampOptions.includes(option.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStampOptions((prev) => [
                            ...prev,
                            option.id,
                          ]);
                        } else {
                          setSelectedStampOptions((prev) =>
                            prev.filter((id) => id !== option.id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-[var(--accent)] bg-black border-[#333333] rounded focus:ring-[var(--accent)] focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#ededed]">
                        {option.label}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {option.placement === "front"
                          ? "Solo adelante"
                          : option.placement === "back"
                          ? "Solo atrás"
                          : "Adelante + Atrás"}
                      </div>
                      {option.extra_cost > 0 && (
                        <div className="text-xs text-green-400 font-medium">
                          +${option.extra_cost}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#ededed] mb-6">
                Imágenes del Producto
              </h2>

              <div className="space-y-4">
                {colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="border border-[#333333] rounded-md p-4"
                  >
                    <h3 className="text-lg font-medium text-[#ededed] mb-4">
                      Imágenes para: {color.nombre || `Color ${colorIndex + 1}`}
                    </h3>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, color.nombre)}
                      className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400"
                    />
                  </div>
                ))}
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[#ededed] mb-4">
                    Vista Previa de Imágenes
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image.preview}
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover rounded-md"
                          width={200}
                          height={128}
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <p className="text-xs text-neutral-400 mt-1 truncate">
                          {image.color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/products"
                className="px-6 py-2 border border-[#333333] rounded-md text-[#ededed] hover:bg-[#1a1a1a]"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--accent)] text-white px-6 py-2 rounded-md hover:bg-[var(--accent-hover)] disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? "Guardando..." : "Guardar Producto"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default NewProduct;
