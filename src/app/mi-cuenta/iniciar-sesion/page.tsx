"use client";

import Link from "next/link";
import { Navbar } from "@/components/organisms/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { z } from "zod";
import { LoginSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    let parsed: z.infer<typeof LoginSchema>;
    try {
      parsed = LoginSchema.parse(form);
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
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: parsed.password,
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
            <li className="text-neutral-300">Iniciar sesión</li>
          </ol>
        </nav>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Iniciar sesión
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-lg space-y-4"
          aria-label="Formulario de inicio de sesión"
        >
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
                autoComplete="current-password"
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

          {serverError && (
            <div className="text-xs text-red-500" role="alert">
              {serverError}
            </div>
          )}

          <Button type="submit" disabled={loading} aria-label="Iniciar sesión">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>

          <p className="text-sm text-neutral-400">
            ¿No tenés una cuenta?{" "}
            <Link
              href="/mi-cuenta/crear-cuenta"
              className="text-[#C2187A] hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
