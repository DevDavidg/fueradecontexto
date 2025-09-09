"use client";

import { Navbar } from "@/components/molecules/navbar";
import { useEffect, useState } from "react";
import type { SectionsContent } from "@/lib/sections-server";
import {
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  ClockIcon,
  CalendarIcon,
  CloseIcon,
} from "@/components/ui/icons";

export default function Contactanos() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    imagen: null as File | null,
  });
  const [content, setContent] = useState<SectionsContent["contactanos"] | null>(
    null
  );

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/sections", { cache: "no-store" });
      const json: SectionsContent = await res.json();
      setContent(json?.contactanos ?? null);
    };
    load();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      imagen: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log("Datos del formulario:", formData);
    alert("¡Formulario enviado correctamente!");
  };

  const handleClear = () => {
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
      imagen: null,
    });
    // Limpiar el input de archivo
    const fileInput = document.getElementById("imagen") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <section className="py-8">
          <div className="mx-auto max-w-4xl">
            {!content ? (
              <div className="animate-pulse">
                <div className="h-3 w-24 bg-neutral-800 rounded" />
                <div className="mt-3 h-8 w-72 bg-neutral-800 rounded" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-full bg-neutral-900 rounded" />
                  <div className="h-4 w-4/5 bg-neutral-900 rounded" />
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                  {content?.titles?.subtitulo ?? "Contáctanos"}
                </p>
                <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">
                  {content?.titles?.tituloPrincipal ?? "Ponte en contacto"}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-neutral-200">
                  {content?.descripcion ?? ""}
                </p>
              </>
            )}
          </div>

          <div className="mt-12 border-t border-neutral-800" />

          <div className="mx-auto max-w-2xl mt-16">
            {!content ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-4 w-40 bg-neutral-800 rounded" />
                <div className="h-10 w-full bg-neutral-900 rounded" />
                <div className="h-4 w-40 bg-neutral-800 rounded" />
                <div className="h-10 w-full bg-neutral-900 rounded" />
                <div className="h-4 w-40 bg-neutral-800 rounded" />
                <div className="h-10 w-full bg-neutral-900 rounded" />
                <div className="h-4 w-40 bg-neutral-800 rounded" />
                <div className="h-24 w-full bg-neutral-900 rounded" />
                <div className="flex gap-4">
                  <div className="h-10 w-1/2 bg-neutral-800 rounded" />
                  <div className="h-10 w-1/2 bg-neutral-800 rounded" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    {content?.formulario?.campos?.find(
                      (c) => c.nombre === "nombre"
                    )?.etiqueta ?? "Nombre completo"}{" "}
                    *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors"
                    placeholder={
                      content?.formulario?.campos?.find(
                        (c) => c.nombre === "nombre"
                      )?.placeholder ?? "Tu nombre completo"
                    }
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    {content?.formulario?.campos?.find(
                      (c) => c.nombre === "email"
                    )?.etiqueta ?? "Correo electrónico"}{" "}
                    *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors"
                    placeholder={
                      content?.formulario?.campos?.find(
                        (c) => c.nombre === "email"
                      )?.placeholder ?? "tu@email.com"
                    }
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    {content?.formulario?.campos?.find(
                      (c) => c.nombre === "telefono"
                    )?.etiqueta ?? "Número telefónico"}
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors"
                    placeholder={
                      content?.formulario?.campos?.find(
                        (c) => c.nombre === "telefono"
                      )?.placeholder ?? "+54 9 11 1234-5678"
                    }
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label
                    htmlFor="mensaje"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    {content?.formulario?.campos?.find(
                      (c) => c.nombre === "mensaje"
                    )?.etiqueta ?? "Mensaje"}{" "}
                    *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder={
                      content?.formulario?.campos?.find(
                        (c) => c.nombre === "mensaje"
                      )?.placeholder ?? "Cuéntanos en qué podemos ayudarte..."
                    }
                  />
                </div>

                {/* Imagen */}
                <div>
                  <label
                    htmlFor="imagen"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    {content?.formulario?.campos?.find(
                      (c) => c.nombre === "imagen"
                    )?.etiqueta ?? "Subir imagen"}
                  </label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-fuchsia-600 file:text-white hover:file:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors"
                  />
                  <p className="mt-1 text-xs text-neutral-400">
                    {content?.formulario?.campos?.find(
                      (c) => c.nombre === "imagen"
                    )?.descripcion ??
                      "Formatos aceptados: JPG, PNG, GIF (máximo 5MB)"}
                  </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    {content?.formulario?.botones?.enviar ??
                      "Enviar formulario"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 bg-white text-black hover:bg-neutral-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    {content?.formulario?.botones?.limpiar ??
                      "Limpiar formulario"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-16 border-t border-neutral-800" />

          {/* Información adicional */}
          <div className="mx-auto max-w-4xl mt-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Información de contacto
                </h3>
                <div className="space-y-3 text-neutral-300">
                  <div className="flex items-center gap-3">
                    <EmailIcon className="w-5 h-5 text-fuchsia-500" />
                    <p>
                      {content?.informacionContacto?.email ??
                        "fueradecontexto04@gmail.com"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-fuchsia-500" />
                    <p>
                      {content?.informacionContacto?.telefono ??
                        "+54 9 11 61965319"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <LocationIcon className="w-5 h-5 text-fuchsia-500" />
                    <p>
                      {content?.informacionContacto?.ubicacion ??
                        "Buenos Aires, Argentina"}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Horarios de atención
                </h3>
                <div className="space-y-2 text-neutral-300">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-fuchsia-500" />
                    <p>
                      {content?.horariosAtencion?.lunesViernes ??
                        "Lunes a Viernes: 9:00 - 18:00"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-fuchsia-500" />
                    <p>
                      {content?.horariosAtencion?.sabados ??
                        "Sábados: 10:00 - 14:00"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CloseIcon className="w-5 h-5 text-neutral-500" />
                    <p>
                      {content?.horariosAtencion?.domingos ??
                        "Domingos: Cerrado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
