"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/organisms/navbar";
import { supabase } from "@/lib/supabase-browser";
import { useProfile } from "@/hooks/use-profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SectionRow = {
  id: string;
  slug: string;
  content: unknown;
  updated_at: string | null;
};

const formatJson = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "{}";
  }
};

export default function AdminSectionsPage() {
  const { profile, loading } = useProfile();
  const [rows, setRows] = useState<SectionRow[]>([]);
  const [loadingRows, setLoadingRows] = useState<boolean>(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [jsonText, setJsonText] = useState<string>("{}");
  const [slugInput, setSlugInput] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const isAdmin = profile?.role === "admin";

  const selectedRow = useMemo(
    () => rows.find((r) => r.slug === selectedSlug) ?? null,
    [rows, selectedSlug]
  );

  const loadRows = async () => {
    setLoadingRows(true);
    setStatus("");
    const { data, error } = await supabase
      .from("sections")
      .select("id, slug, content, updated_at")
      .order("slug", { ascending: true });
    setLoadingRows(false);
    if (error) {
      setStatus(`Error cargando secciones: ${error.message}`);
      return;
    }
    setRows((data ?? []) as SectionRow[]);
  };

  useEffect(() => {
    if (!isAdmin) return;
    void loadRows();
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedRow) return;
    setJsonText(formatJson(selectedRow.content));
  }, [selectedRow?.id]);

  const handleSelect = (slug: string) => {
    setSelectedSlug(slug);
  };

  const handleCreate = async () => {
    if (!slugInput.trim()) {
      setStatus("Ingresá un slug");
      return;
    }
    try {
      const initial = {};
      const { error } = await supabase
        .from("sections")
        .upsert(
          { slug: slugInput.trim(), content: initial },
          { onConflict: "slug" }
        );
      if (error) throw error;
      setStatus("Sección creada/actualizada");
      setSelectedSlug(slugInput.trim());
      setSlugInput("");
      await loadRows();
    } catch (e: any) {
      setStatus(`Error creando sección: ${e.message ?? e}`);
    }
  };

  const handleSave = async () => {
    try {
      const parsed = jsonText.trim() ? JSON.parse(jsonText) : {};
      if (!selectedSlug) {
        setStatus("Seleccioná una sección primero");
        return;
      }
      const { error } = await supabase
        .from("sections")
        .upsert(
          { slug: selectedSlug, content: parsed },
          { onConflict: "slug" }
        );
      if (error) throw error;
      setStatus("Cambios guardados");
      await loadRows();
    } catch (e: any) {
      setStatus(`JSON inválido o error guardando: ${e.message ?? e}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedSlug) return;
    const confirmed = window.confirm(
      `¿Eliminar la sección "${selectedSlug}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    const { error } = await supabase
      .from("sections")
      .delete()
      .eq("slug", selectedSlug);
    if (error) {
      setStatus(`Error eliminando: ${error.message}`);
      return;
    }
    setStatus("Sección eliminada");
    setSelectedSlug("");
    setJsonText("{}");
    await loadRows();
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
          <ol className="flex items-center gap-1">
            <li>
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <span className="px-1">›</span>
            </li>
            <li className="text-neutral-300">Admin · Sections</li>
          </ol>
        </nav>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Editor de Sections
        </h1>

        {loading ? (
          <p className="mt-6 text-sm text-neutral-400">Cargando…</p>
        ) : !isAdmin ? (
          <p className="mt-6 text-sm text-red-400">
            Acceso restringido. Necesitás rol admin.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Listado */}
            <aside className="md:col-span-1 border border-[#333333] rounded-lg p-3 bg-[#0b0b0b]">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nuevo slug (p.ej. productos)"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  fullWidth
                />
                <Button onClick={handleCreate}>Crear</Button>
              </div>
              <div className="mt-3 h-px bg-[#222]" />
              <ul className="mt-3 space-y-1 text-sm max-h-[480px] overflow-y-auto">
                {loadingRows ? (
                  <li className="text-neutral-500">Cargando…</li>
                ) : rows.length === 0 ? (
                  <li className="text-neutral-500">Sin secciones</li>
                ) : (
                  rows.map((r) => (
                    <li key={r.id}>
                      <button
                        className={`w-full text-left px-2 py-1 rounded hover:bg-[#141414] ${
                          selectedSlug === r.slug ? "bg-[#151515]" : ""
                        }`}
                        onClick={() => handleSelect(r.slug)}
                        aria-label={`Seleccionar ${r.slug}`}
                      >
                        <span className="font-medium">{r.slug}</span>
                        <span className="ml-2 text-xs text-neutral-500">
                          {r.updated_at
                            ? new Date(r.updated_at).toLocaleString()
                            : ""}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="secondary" onClick={loadRows}>
                  Refrescar
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={!selectedSlug}
                >
                  Eliminar
                </Button>
              </div>
            </aside>

            {/* Editor */}
            <section className="md:col-span-2 border border-[#333333] rounded-lg p-3 bg-[#0b0b0b]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-400">
                  {selectedSlug
                    ? `Editando: ${selectedSlug}`
                    : "Seleccioná una sección"}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleSave}
                    disabled={!selectedSlug}
                  >
                    Guardar cambios
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <textarea
                  className="w-full h-[520px] bg-[#0a0a0a] border border-[#333333] rounded-md p-3 text-sm font-mono text-[#ededed] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]"
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  spellCheck={false}
                  aria-label="Editor JSON de sección"
                />
              </div>
              {status && (
                <p className="mt-2 text-xs text-neutral-400">{status}</p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
