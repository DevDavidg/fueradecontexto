import { z } from "zod";

export const SectionsSchema = z
  .object({
    inicio: z
      .object({
        secciones: z
          .object({
            hero: z
              .object({
                titulo: z.string().optional().nullable(),
                descripcion: z.string().optional().nullable(),
              })
              .optional(),
            productos: z
              .object({
                titulo: z.string().optional().nullable(),
                subtitulo: z.string().optional().nullable(),
              })
              .optional(),
          })
          .partial(),
      })
      .optional(),
    productos: z
      .object({
        titles: z
          .object({
            tituloPrincipal: z.string().optional().nullable(),
            subtitulo: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
        categorias: z
          .object({
            buzos: z
              .object({
                titulo: z.string().optional().nullable(),
                estado: z.string().optional().nullable(),
                descripcion: z.string().optional().nullable(),
              })
              .partial()
              .optional(),
            camperas: z
              .object({
                titulo: z.string().optional().nullable(),
                estado: z.string().optional().nullable(),
                descripcion: z.string().optional().nullable(),
              })
              .partial()
              .optional(),
            totebags: z
              .object({
                titulo: z.string().optional().nullable(),
                estado: z.string().optional().nullable(),
                descripcion: z.string().optional().nullable(),
              })
              .partial()
              .optional(),
            gorras: z
              .object({
                titulo: z.string().optional().nullable(),
                estado: z.string().optional().nullable(),
                descripcion: z.string().optional().nullable(),
              })
              .partial()
              .optional(),
          })
          .partial()
          .optional(),
        tablaTalles: z
          .object({
            titulo: z.string().optional().nullable(),
            medidas: z
              .array(
                z.object({
                  talle: z.string(),
                  ancho: z.union([z.number(), z.string()]),
                  largo: z.union([z.number(), z.string()]),
                  equivalencia: z.string(),
                })
              )
              .optional()
              .default([]),
            notas: z.array(z.string()).optional().default([]),
          })
          .partial()
          .optional(),
      })
      .optional(),
    sobreNosotros: z
      .object({
        titles: z
          .object({
            tituloPrincipal: z.string().optional().nullable(),
            subtitulo: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
        historia: z
          .object({
            parrafo1: z.string().optional().nullable(),
            parrafo2: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
        mision: z
          .object({
            titulo: z.string().optional().nullable(),
            descripcion: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
        vision: z
          .object({
            titulo: z.string().optional().nullable(),
            descripcion: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
        valores: z
          .object({
            titulo: z.string().optional().nullable(),
            descripcion: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
      })
      .optional(),
    contactanos: z
      .object({
        titles: z
          .object({
            tituloPrincipal: z.string().optional().nullable(),
            subtitulo: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
        descripcion: z.string().optional().nullable(),
        formulario: z
          .object({
            campos: z
              .array(
                z.object({
                  nombre: z.string(),
                  etiqueta: z.string().optional().nullable(),
                  tipo: z.string().optional().nullable(),
                  requerido: z.boolean().optional(),
                  placeholder: z.string().optional().nullable(),
                  filas: z.number().optional(),
                  acepta: z.string().optional().nullable(),
                  descripcion: z.string().optional().nullable(),
                })
              )
              .optional()
              .default([]),
            botones: z
              .object({
                enviar: z.string().optional().nullable(),
                limpiar: z.string().optional().nullable(),
              })
              .partial()
              .optional(),
          })
          .partial()
          .optional(),
        informacionContacto: z
          .object({
            email: z.string().optional().nullable(),
            telefono: z.string().optional().nullable(),
            ubicacion: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
        horariosAtencion: z
          .object({
            lunesViernes: z.string().optional().nullable(),
            sabados: z.string().optional().nullable(),
            domingos: z.string().optional().nullable(),
          })
          .partial()
          .optional(),
      })
      .optional(),
  })
  .and(
    z.object({
      checkout: z
        .object({
          titles: z
            .object({
              tituloPrincipal: z.string().optional().nullable(),
            })
            .partial()
            .optional(),
          carritoVacio: z.string().optional().nullable(),
          resumen: z
            .object({
              subtotal: z.string().optional().nullable(),
              botonPagar: z.string().optional().nullable(),
              descripcionPago: z.string().optional().nullable(),
            })
            .partial()
            .optional(),
          procesoPago: z
            .object({
              asuntoEmail: z.string().optional().nullable(),
              cuerpoEmail: z.string().optional().nullable(),
            })
            .partial()
            .optional(),
        })
        .optional(),
    })
  );

export type Sections = z.infer<typeof SectionsSchema>;

export const RawProductSchema = z.object({
  id: z.string().optional(),
  nombre: z.string(),
  categoria: z.string().optional(),
  talles: z
    .array(
      z.union([z.enum(["XS", "S", "M", "L", "XL", "XXL"]), z.literal("Único")])
    )
    .default([]),
  colores: z
    .array(
      z.union([z.string(), z.object({ nombre: z.string(), hex: z.string() })])
    )
    .default([]),
  descripcion: z.string().default(""),
  precio: z.object({
    normal: z.number(),
    transferencia: z.number().optional(),
  }),
  metodos_pago: z.array(z.string()).optional().default([]),
  imagenes: z
    .array(z.object({ color: z.string(), url: z.string() }))
    .default([]),
  tamaño_estampa: z.record(z.string(), z.number()).default({}),
  envio: z.object({ metodo: z.string(), codigo_postal: z.string() }).optional(),
  stock: z
    .record(z.string(), z.record(z.string(), z.number().default(0)))
    .default({}),
});

export type RawProduct = z.infer<typeof RawProductSchema>;

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Ingresá tu nombre y apellido" })
      .max(120),
    email: z.string().email("Email inválido").toLowerCase().trim(),
    phone: z
      .string()
      .optional()
      .transform((v) => (v ? v.trim() : undefined))
      .refine((v) => (v ? /^\+?\d{7,15}$/.test(v) : true), {
        message: "Teléfono inválido",
      }),
    password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "Mínimo 6 caracteres" }),
    acceptTerms: z.boolean().optional().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export const LoginSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase().trim(),
  password: z.string().min(1, { message: "Ingresá tu contraseña" }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
