"use client";

import Link from "next/link";
import { Navbar } from "@/components/organisms/navbar";
import { supabase } from "@/lib/supabase-browser";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { useProfile } from "@/hooks/use-profile";

export default function AccountPage() {
  const { user } = useSupabaseUser();
  const { profile } = useProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
            <li className="text-neutral-300">Mi Cuenta</li>
          </ol>
        </nav>

        <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
          Mi Cuenta
        </h1>

        {!user ? (
          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#333333] rounded-lg p-4 bg-[#0b0b0b]">
              <h2 className="text-lg font-medium">¿Ya tenés una cuenta?</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Iniciá sesión para ver tus datos y continuar tu compra.
              </p>
              <Link
                href="/mi-cuenta/iniciar-sesion"
                className="mt-3 inline-flex items-center justify-center rounded-md bg-[#C2187A] text-white text-sm h-10 px-4 hover:bg-pink-700"
                aria-label="Ir a iniciar sesión"
              >
                Iniciar sesión
              </Link>
            </div>
            <div className="border border-[#333333] rounded-lg p-4 bg-[#0b0b0b]">
              <h2 className="text-lg font-medium">¿Sos nuevo?</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Creá tu cuenta para comprar más rápido y llevar control de tus
                pedidos.
              </p>
              <Link
                href="/mi-cuenta/crear-cuenta"
                className="mt-3 inline-flex items-center justify-center rounded-md border border-[#333333] text-[#ededed] text-sm h-10 px-4 hover:bg-[#1a1a1a]"
                aria-label="Ir a crear cuenta"
              >
                Crear cuenta
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-6 border border-[#333333] rounded-lg p-4 bg-[#0b0b0b]">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium">
                Hola, {user.fullName ?? user.email}
              </h2>
              {profile?.role === "admin" && (
                <span className="inline-flex items-center text-xs px-2 py-1 rounded bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-700/50">
                  Admin
                </span>
              )}
            </div>
            <dl className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="border border-[#333333] rounded-md p-3 bg-[#0a0a0a]">
                <dt className="text-neutral-400">Email</dt>
                <dd className="mt-1">{user.email}</dd>
              </div>
              {user.phone ? (
                <div className="border border-[#333333] rounded-md p-3 bg-[#0a0a0a]">
                  <dt className="text-neutral-400">Teléfono</dt>
                  <dd className="mt-1">{user.phone}</dd>
                </div>
              ) : null}
            </dl>
            <button
              onClick={handleLogout}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-transparent text-[#ededed] text-sm h-10 px-4 border border-[#333333] hover:bg-[#1a1a1a]"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
            {profile?.role === "admin" ? (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-neutral-300 mb-3">
                  Panel de Administración
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] text-white text-sm h-9 px-3 hover:bg-[var(--accent-hover)]"
                  >
                    Dashboard Admin
                  </Link>
                  <Link
                    href="/admin/products"
                    className="inline-flex items-center justify-center rounded-md bg-green-600 text-white text-sm h-9 px-3 hover:bg-green-700"
                  >
                    Gestión de Productos
                  </Link>
                  <Link
                    href="/admin/sections"
                    className="inline-flex items-center justify-center rounded-md bg-[#C2187A] text-white text-sm h-9 px-3 hover:bg-pink-700"
                  >
                    Editor de Sections
                  </Link>
                  <Link
                    href="/admin/users"
                    className="inline-flex items-center justify-center rounded-md bg-purple-600 text-white text-sm h-9 px-3 hover:bg-purple-700"
                  >
                    Gestión de Usuarios
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/create-admin", {
                        method: "POST",
                      });
                      const result = await response.json();
                      if (response.ok) {
                        alert(
                          "Perfil de admin creado exitosamente. Recarga la página."
                        );
                        window.location.reload();
                      } else {
                        alert(`Error: ${result.error}`);
                      }
                    } catch (error) {
                      console.error("Error creating admin profile:", error);
                      alert("Error al crear perfil de admin");
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-green-600 text-white text-sm h-9 px-3 hover:bg-green-700"
                >
                  Crear perfil de Admin
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
