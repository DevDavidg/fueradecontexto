"use client";

import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileAdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProfileAdminGuard = ({
  children,
  fallback,
}: ProfileAdminGuardProps) => {
  const { user, loading: userLoading } = useSupabaseUser();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile();
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Only redirect if we're done loading and user is not admin
    if (!userLoading && !profileLoading) {
      if (!user) {
        if (!redirected) {
          setRedirected(true);
          router.push("/mi-cuenta/iniciar-sesion");
        }
        return;
      }

      if (profileError) {
        if (!redirected) {
          setRedirected(true);
          router.push("/mi-cuenta/iniciar-sesion");
        }
        return;
      }

      if (profile && profile.role !== "admin") {
        if (!redirected) {
          setRedirected(true);
          router.push("/mi-cuenta/iniciar-sesion");
        }
        return;
      }
    }
  }, [
    user,
    userLoading,
    profile,
    profileLoading,
    profileError,
    router,
    redirected,
  ]);

  // Show loading while checking
  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Autenticado
          </h1>
          <p className="text-gray-600 mb-4">
            Necesitas iniciar sesión para acceder a esta sección.
          </p>
          <button
            onClick={() => router.push("/mi-cuenta/iniciar-sesion")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Profile error
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error de Perfil
          </h1>
          <p className="text-gray-600 mb-4">
            Error al cargar el perfil: {profileError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Not admin
  if (profile && profile.role !== "admin") {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-gray-600 mb-4">
              No tienes permisos de administrador para acceder a esta sección.
            </p>
            <p className="text-sm text-gray-500 mb-4">Usuario: {user.email}</p>
            <p className="text-sm text-gray-500 mb-4">
              Rol: {profile?.role || "No disponible"}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )
    );
  }

  // Admin access granted
  if (profile && profile.role === "admin") {
    return <>{children}</>;
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando permisos...</p>
      </div>
    </div>
  );
};
