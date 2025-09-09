"use client";

import Link from "next/link";
import { Navbar } from "@/components/organisms/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { z } from "zod";
import { RegisterSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function CreateAccountPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});
    let parsed: z.infer<typeof RegisterSchema>;
    try {
      parsed = RegisterSchema.parse({ ...form, acceptTerms: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormState, string>> = {};
        for (const issue of err.issues) {
          const key = issue.path[0] as keyof FormState;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors);
        return;
      }
      setServerError("Error inesperado");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        data: {
          fullName: parsed.fullName,
          phone: parsed.phone ?? null,
        },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/mi-cuenta`
            : undefined,
      },
    });
    setLoading(false);
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push("/mi-cuenta");
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
            <li>
              <Link href="/mi-cuenta" className="hover:underline">
                Mi Cuenta
              </Link>
            </li>
            <li>
              <span className="px-1">›</span>
            </li>
            <li className="text-neutral-300">Crear cuenta</li>
          </ol>
        </nav>

        <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
          Crear cuenta
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Comprá más rápido y llevá el control de tus pedidos, ¡en un solo
          lugar!
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-lg space-y-4"
          aria-label="Formulario de creación de cuenta"
        >
          <div>
            <Label htmlFor="fullName" className="text-neutral-300">
              Nombre y apellido
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange("fullName")}
              placeholder="ej.: María Perez"
              autoComplete="name"
              fullWidth
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-neutral-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="ej.: tuemail@email.com"
              autoComplete="email"
              fullWidth
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-neutral-300">
              Teléfono (opcional)
            </Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="ej.: 1123445567"
              autoComplete="tel"
              fullWidth
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-neutral-300">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                placeholder="ej.: tucontraseña"
                autoComplete="new-password"
                fullWidth
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-200"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Mostrar u ocultar contraseña"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-neutral-300">
              Confirmar contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="ej.: tucontraseña"
                autoComplete="new-password"
                fullWidth
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-200"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label="Mostrar u ocultar confirmación de contraseña"
              >
                {showConfirm ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {serverError && (
            <div className="text-xs text-red-500" role="alert">
              {serverError}
            </div>
          )}

          <Button type="submit" disabled={loading} aria-label="Crear cuenta">
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>

          <p className="text-sm text-neutral-400">
            ¿Ya tenés una cuenta?{" "}
            <Link
              href="/mi-cuenta/iniciar-sesion"
              className="text-[#C2187A] hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
