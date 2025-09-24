"use client";

import { ProfileAdminGuard } from "@/components/providers/profile-admin-guard";
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter, useParams } from "next/navigation";
import { useLogger } from "@/hooks/use-logger";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Info,
  DollarSign,
  Palette,
  Ruler,
  Image as ImageIcon,
  CreditCard,
  Truck,
  Stamp,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  Skeleton,
  SkeletonFormSection,
} from "@/components/molecules/skeleton-loading";

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
  key?: string;
  label?: string;
}

interface StampOption {
  id: string;
  placement: string;
  size_id: string;
  label: string;
  extra_cost: number;
}

interface Product {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio_normal: number;
  precio_transferencia: number;
  metodos_pago: string[];
  envio_metodo: string;
  envio_codigo_postal: string;
}

const EditProduct = () => {
  const logger = useLogger();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState(0);

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
  const [images, setImages] = useState<
    { color: string; file: File; preview: string }[]
  >([]);
  const [existingImages, setExistingImages] = useState<
    { id: string; color: string; url: string }[]
  >([]);
  const [availableStampOptions, setAvailableStampOptions] = useState<
    StampOption[]
  >([]);
  const [selectedStampOptions, setSelectedStampOptions] = useState<string[]>(
    []
  );

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

  const sizeLabels = useMemo(
    () => ({
      hasta_15cm: "Hasta 15cm",
      hasta_20x30cm: "Hasta 20x30cm",
      hasta_30x40cm: "Hasta 30x40cm",
      hasta_40x50cm: "Hasta 40x50cm",
    }),
    []
  );

  const getSizeLabel = useCallback(
    (sizeKey: string) => {
      return sizeLabels[sizeKey as keyof typeof sizeLabels] || sizeKey;
    },
    [sizeLabels]
  );

  const fetchProductData = useCallback(async () => {
    try {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Set form data
      setFormData({
        nombre: productData.nombre,
        categoria: productData.categoria,
        descripcion: productData.descripcion,
        precio_normal: productData.precio_normal.toString(),
        precio_transferencia: productData.precio_transferencia.toString(),
        metodos_pago: productData.metodos_pago || [],
        envio_metodo: productData.envio_metodo || "",
        envio_codigo_postal: productData.envio_codigo_postal || "",
      });

      // Fetch colors
      const { data: colorsData, error: colorsError } = await supabase
        .from("product_colors")
        .select("*")
        .eq("product_id", productId);

      if (colorsError) throw colorsError;
      setColors(colorsData || []);

      // Fetch sizes
      const { data: sizesData, error: sizesError } = await supabase
        .from("product_sizes")
        .select("*")
        .eq("product_id", productId);

      if (sizesError) throw sizesError;
      setSizes(sizesData || []);

      // Fetch print sizes
      const { data: printSizesData, error: printSizesError } = await supabase
        .from("product_print_sizes")
        .select("*")
        .eq("product_id", productId);

      if (printSizesError) throw printSizesError;
      setPrintSizes(printSizesData || []);

      // Fetch existing images
      const { data: imagesData, error: imagesError } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId);

      if (imagesError) throw imagesError;
      setExistingImages(imagesData || []);

      // Fetch stamp options
      const { data: stampOptionsData, error: stampOptionsError } =
        await supabase
          .from("product_stamp_options")
          .select("stamp_option_id")
          .eq("product_id", productId);

      if (stampOptionsError) throw stampOptionsError;
      setSelectedStampOptions(
        stampOptionsData?.map((item) => item.stamp_option_id) || []
      );
    } catch (error) {
      logger.error("Error loading product data", error, {
        component: "EditProduct",
        action: "fetchProductData",
        metadata: { productId },
      });
      alert("Error al cargar los datos del producto");
    } finally {
      setLoading(false);
    }
  }, [productId, logger]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      logger.error("Error fetching categories", error, {
        component: "EditProduct",
        action: "fetchCategories",
      });
    }
  }, [logger]);

  const fetchStampOptions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("stamp_options")
        .select("*")
        .order("placement", { ascending: true })
        .order("size_id", { ascending: true });

      if (error) throw error;
      setAvailableStampOptions(data || []);
    } catch (error) {
      logger.error("Error fetching stamp options", error, {
        component: "EditProduct",
        action: "fetchStampOptions",
      });
    }
  }, [logger]);

  const fetchDynamicPrintSizes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("print_sizes")
        .select("*")
        .order("price", { ascending: true });

      if (error) {
        logger.warn("Print sizes table not found, using fallback data", {
          component: "EditProduct",
          action: "fetchDynamicPrintSizes",
        });
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
        label: getSizeLabel(size.size_key),
      }));

      setDynamicPrintSizes(sizesWithLabels);
    } catch (error) {
      logger.error("Error fetching print sizes", error, {
        component: "EditProduct",
        action: "fetchDynamicPrintSizes",
      });
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
  }, [logger, getSizeLabel]);

  useEffect(() => {
    if (productId) {
      fetchProductData();
      fetchCategories();
      fetchStampOptions();
      fetchDynamicPrintSizes();
    }
  }, [
    productId,
    fetchProductData,
    fetchCategories,
    fetchStampOptions,
    fetchDynamicPrintSizes,
  ]);

  const calculateTotalPrice = useCallback(() => {
    const basePrice = parseInt(formData.precio_normal) || 0;
    const selectedStampCosts = selectedStampOptions.reduce((total, stampId) => {
      const stamp = availableStampOptions.find((s) => s.id === stampId);
      return total + (stamp?.extra_cost || 0);
    }, 0);
    setTotalPrice(basePrice + selectedStampCosts);
  }, [formData.precio_normal, selectedStampOptions, availableStampOptions]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del producto es obligatorio";
    }

    if (!formData.categoria) {
      newErrors.categoria = "Debes seleccionar una categoría";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    if (!formData.precio_normal || parseInt(formData.precio_normal) <= 0) {
      newErrors.precio_normal = "El precio debe ser mayor a 0";
    }

    if (colors.length === 0) {
      newErrors.colors = "Debes agregar al menos un color";
    }

    if (sizes.length === 0) {
      newErrors.sizes = "Debes agregar al menos un tamaño";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  const removeExistingImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      logger.error("Error deleting image", error, {
        component: "EditProduct",
        action: "handleDeleteImage",
        metadata: { imageId },
      });
      alert("Error al eliminar la imagen");
    }
  };

  const uploadImagesToSupabase = async () => {
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
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Validate form
      if (!validateForm()) {
        setSaving(false);
        return;
      }

      // Update product
      const { error: productError } = await supabase
        .from("products")
        .update({
          nombre: formData.nombre,
          categoria: formData.categoria,
          descripcion: formData.descripcion,
          precio_normal: parseInt(formData.precio_normal),
          precio_transferencia: parseInt(formData.precio_transferencia),
          metodos_pago: formData.metodos_pago,
          envio_metodo: formData.envio_metodo,
          envio_codigo_postal: formData.envio_codigo_postal,
        })
        .eq("id", productId);

      if (productError) throw productError;

      // Delete existing colors and insert new ones
      await supabase
        .from("product_colors")
        .delete()
        .eq("product_id", productId);
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

      // Delete existing sizes and insert new ones
      await supabase.from("product_sizes").delete().eq("product_id", productId);
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

      // Delete existing print sizes and insert new ones
      await supabase
        .from("product_print_sizes")
        .delete()
        .eq("product_id", productId);
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

      // Delete existing stamp options and insert new ones
      await supabase
        .from("product_stamp_options")
        .delete()
        .eq("product_id", productId);
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

      // Upload new images
      if (images.length > 0) {
        await uploadImagesToSupabase();
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Error al actualizar el producto"
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
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <SkeletonFormSection />
            <SkeletonFormSection />
            <SkeletonFormSection />
            <SkeletonFormSection />
            <SkeletonFormSection />
            <SkeletonFormSection />
            <SkeletonFormSection />
          </div>
        </div>
      </ProfileAdminGuard>
    );
  }

  if (!product) {
    return (
      <ProfileAdminGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#ededed] mb-4">
              Producto no encontrado
            </h1>
            <Link
              href="/admin/products"
              className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-hover)]"
            >
              Volver a productos
            </Link>
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
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/products"
                  className="text-neutral-400 hover:text-[#ededed] transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-[#ededed] flex items-center gap-3">
                    <Stamp className="h-8 w-8 text-[var(--accent)]" />
                    Editar Producto
                  </h1>
                  <p className="text-neutral-400 mt-1 flex items-center gap-2">
                    <span>{product.nombre}</span>
                    {totalPrice > 0 && (
                      <span className="text-green-400 font-medium">
                        • Precio total: ${totalPrice.toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {saveSuccess && (
                <div className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>¡Producto guardado exitosamente!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <Info className="h-6 w-6 text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Información Básica
                </h2>
              </div>

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
                    className={`w-full px-3 py-2 bg-black border rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400 transition-colors ${
                      errors.nombre ? "border-red-500" : "border-[#333333]"
                    }`}
                    placeholder="Ej: Buzo Personalizado"
                  />
                  {errors.nombre && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.nombre}
                    </p>
                  )}
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
                    className={`w-full px-3 py-2 bg-black border rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400 transition-colors ${
                      errors.categoria ? "border-red-500" : "border-[#333333]"
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoria && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.categoria}
                    </p>
                  )}
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
                    className={`w-full px-3 py-2 bg-black border rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400 transition-colors ${
                      errors.descripcion ? "border-red-500" : "border-[#333333]"
                    }`}
                    placeholder="Describe las características y beneficios del producto..."
                  />
                  {errors.descripcion && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.descripcion}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="h-6 w-6 text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Precios Base
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Precio Normal (ARS) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                      $
                    </span>
                    <input
                      type="number"
                      name="precio_normal"
                      value={formData.precio_normal}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full pl-8 pr-3 py-2 bg-black border rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400 transition-colors ${
                        errors.precio_normal
                          ? "border-red-500"
                          : "border-[#333333]"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  {errors.precio_normal && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.precio_normal}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Precio Transferencia (ARS)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                      $
                    </span>
                    <input
                      type="number"
                      name="precio_transferencia"
                      value={formData.precio_transferencia}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full pl-8 pr-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400 transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Precio especial para pagos por transferencia bancaria
                  </p>
                </div>
              </div>

              {/* Price Summary */}
              {totalPrice > 0 && (
                <div className="mt-6 p-4 bg-green-900/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-medium">
                        Precio Total Estimado:
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-green-400">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-green-300 mt-1">
                    Incluye precio base + opciones de estampas seleccionadas
                  </p>
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Palette className="h-6 w-6 text-[var(--accent)]" />
                  <h2 className="text-xl font-semibold text-[#ededed]">
                    Colores Disponibles
                  </h2>
                  {colors.length > 0 && (
                    <span className="bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full">
                      {colors.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Color</span>
                </button>
              </div>

              {errors.colors && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.colors}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <div className="relative">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) =>
                          updateColor(index, "hex", e.target.value)
                        }
                        className="w-12 h-12 border border-[#333333] rounded cursor-pointer hover:scale-105 transition-transform"
                      />
                      <div
                        className="absolute inset-0 rounded border-2 border-white/20 pointer-events-none"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Nombre del color (ej: Negro, Blanco, Azul)"
                      value={color.nombre}
                      onChange={(e) =>
                        updateColor(index, "nombre", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] placeholder-neutral-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-md transition-colors"
                      title="Eliminar color"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {colors.length === 0 && (
                  <div className="text-center py-8 text-neutral-400">
                    <Palette className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hay colores agregados</p>
                    <p className="text-sm">
                      Haz clic en &quot;Agregar Color&quot; para comenzar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Ruler className="h-6 w-6 text-[var(--accent)]" />
                  <h2 className="text-xl font-semibold text-[#ededed]">
                    Tamaños Disponibles
                  </h2>
                  {sizes.length > 0 && (
                    <span className="bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full">
                      {sizes.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addSize}
                  className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Tamaño</span>
                </button>
              </div>

              {errors.sizes && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.sizes}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {sizes.map((size, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <select
                      value={size.size}
                      onChange={(e) => updateSize(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] placeholder-neutral-400 transition-colors"
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
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-md transition-colors"
                      title="Eliminar tamaño"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {sizes.length === 0 && (
                  <div className="text-center py-8 text-neutral-400">
                    <Ruler className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hay tamaños agregados</p>
                    <p className="text-sm">
                      Haz clic en &quot;Agregar Tamaño&quot; para comenzar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Print Sizes */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Stamp className="h-6 w-6 text-[var(--accent)]" />
                  <h2 className="text-xl font-semibold text-[#ededed]">
                    Tamaños de Estampa
                  </h2>
                  {printSizes.length > 0 && (
                    <span className="bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full">
                      {printSizes.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addPrintSize}
                  className="bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Tamaño</span>
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">
                    Información sobre tamaños de estampa
                  </span>
                </div>
                <p className="text-xs text-blue-300">
                  Los tamaños de estampa determinan el costo adicional por
                  personalización. Selecciona los tamaños disponibles para este
                  producto.
                </p>
              </div>

              <div className="space-y-4">
                {printSizes.map((printSize, index) => {
                  const selectedSize = dynamicPrintSizes.find(
                    (s) => s.size_key === printSize.size_key
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border border-[#333333] rounded-md hover:border-[var(--accent)]/50 transition-colors"
                    >
                      <div className="flex-1">
                        <select
                          value={printSize.size_key}
                          onChange={(e) =>
                            updatePrintSize(index, "size_key", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] placeholder-neutral-400 transition-colors"
                        >
                          <option value="">
                            Selecciona un tamaño de estampa
                          </option>
                          {dynamicPrintSizes.map((option) => (
                            <option
                              key={option.size_key}
                              value={option.size_key}
                            >
                              {getSizeLabel(option.size_key)} - $
                              {option.price.toLocaleString()}
                            </option>
                          ))}
                        </select>
                        {selectedSize && (
                          <p className="text-xs text-neutral-400 mt-1">
                            Tamaño base: {getSizeLabel(selectedSize.size_key)}
                          </p>
                        )}
                      </div>

                      <div className="w-32">
                        <label className="block text-xs text-neutral-400 mb-1">
                          Precio Extra
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            placeholder="0"
                            value={printSize.price}
                            onChange={(e) =>
                              updatePrintSize(
                                index,
                                "price",
                                parseInt(e.target.value) || 0
                              )
                            }
                            min="0"
                            className="w-full pl-8 pr-3 py-2 bg-black text-[#ededed] border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removePrintSize(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-md transition-colors"
                        title="Eliminar tamaño de estampa"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}

                {printSizes.length === 0 && (
                  <div className="text-center py-8 text-neutral-400">
                    <Stamp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hay tamaños de estampa configurados</p>
                    <p className="text-sm">
                      Haz clic en &quot;Agregar Tamaño&quot; para comenzar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Métodos de Pago
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method}
                    className="flex items-center space-x-3 p-3 border border-[#333333] rounded-lg cursor-pointer hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.metodos_pago.includes(method)}
                      onChange={(e) =>
                        handlePaymentMethodChange(method, e.target.checked)
                      }
                      className="w-4 h-4 text-[var(--accent)] bg-black border-[#333333] rounded focus:ring-[var(--accent)] focus:ring-2"
                    />
                    <span className="text-sm text-[#ededed] font-medium">
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="h-6 w-6 text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[#ededed]">Envío</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#ededed] mb-2">
                    Método de Envío
                  </label>
                  <select
                    name="envio_metodo"
                    value={formData.envio_metodo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400 transition-colors"
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
                    className="w-full px-3 py-2 bg-black border border-[#333333] rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] text-[#ededed] placeholder-neutral-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Stamp Options */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <Stamp className="h-6 w-6 text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Opciones de Estampas
                </h2>
                {selectedStampOptions.length > 0 && (
                  <span className="bg-[var(--accent)] text-white text-xs px-2 py-1 rounded-full">
                    {selectedStampOptions.length} seleccionadas
                  </span>
                )}
              </div>

              <div className="mb-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">
                    Configuración de Estampas
                  </span>
                </div>
                <p className="text-xs text-blue-300 mb-2">
                  Selecciona qué opciones de estampas estarán disponibles para
                  este producto. Los clientes podrán elegir entre estas opciones
                  al personalizar su pedido.
                </p>
                {selectedStampOptions.length > 0 && (
                  <div className="mt-3 p-2 bg-green-900/20 border border-green-500/30 rounded">
                    <p className="text-green-400 text-xs font-medium">
                      Costo adicional total: +$
                      {selectedStampOptions
                        .reduce((total, id) => {
                          const option = availableStampOptions.find(
                            (o) => o.id === id
                          );
                          return total + (option?.extra_cost || 0);
                        }, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableStampOptions.map((option) => {
                  const isSelected = selectedStampOptions.includes(option.id);
                  const placementText =
                    option.placement === "front"
                      ? "Solo adelante"
                      : option.placement === "back"
                      ? "Solo atrás"
                      : "Adelante + Atrás";

                  return (
                    <label
                      key={option.id}
                      className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-[var(--accent)] bg-[var(--accent)]/5"
                          : "border-[#333333] hover:border-[var(--accent)]/50 hover:bg-neutral-900/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
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
                        className="w-4 h-4 text-[var(--accent)] bg-black border-[#333333] rounded focus:ring-[var(--accent)] focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-[#ededed]">
                            {option.label}
                          </div>
                          {option.extra_cost > 0 && (
                            <div className="text-xs text-green-400 font-bold bg-green-900/20 px-2 py-1 rounded">
                              +${option.extra_cost.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 mb-2">
                          {placementText}
                        </div>
                        {option.extra_cost === 0 && (
                          <div className="text-xs text-blue-400 font-medium">
                            Sin costo adicional
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {availableStampOptions.length === 0 && (
                <div className="text-center py-8 text-neutral-400">
                  <Stamp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay opciones de estampas disponibles</p>
                  <p className="text-sm">
                    Contacta al administrador para configurar las opciones
                  </p>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="bg-[#0b0b0b] border border-[#333333] rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="h-6 w-6 text-[var(--accent)]" />
                <h2 className="text-xl font-semibold text-[#ededed]">
                  Imágenes del Producto
                </h2>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#ededed] mb-4">
                    Imágenes Actuales
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative">
                        <Image
                          src={image.url}
                          alt={`Product image for ${image.color}`}
                          className="w-full h-32 object-cover rounded-md"
                          width={200}
                          height={128}
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
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

              {/* Add New Images */}
              <div className="space-y-4">
                {colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="border border-[#333333] rounded-md p-4"
                  >
                    <h3 className="text-lg font-medium text-[#ededed] mb-4">
                      Agregar imágenes para:{" "}
                      {color.nombre || `Color ${colorIndex + 1}`}
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

              {/* New Image Previews */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[#ededed] mb-4">
                    Vista Previa de Nuevas Imágenes
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
            <div className="flex justify-between items-center pt-6 border-t border-[#333333]">
              <div className="text-sm text-neutral-400">
                {Object.keys(errors).length > 0 && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Por favor corrige los errores antes de guardar</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Link
                  href="/admin/products"
                  className="px-6 py-3 border border-[#333333] rounded-md text-[#ededed] hover:bg-[#1a1a1a] transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={saving || Object.keys(errors).length > 0}
                  className="bg-[var(--accent)] text-white px-6 py-3 rounded-md hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProfileAdminGuard>
  );
};

export default EditProduct;
