import { z } from "zod";

// Sections schema (minimal, aligned to current usage)
export const SectionsSchema = z.object({
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
          remeras: z
            .object({ titulo: z.string().optional().nullable() })
            .partial()
            .optional(),
          buzos: z
            .object({
              titulo: z.string().optional().nullable(),
              descripcion: z.string().optional().nullable(),
            })
            .partial()
            .optional(),
          gorras: z
            .object({
              titulo: z.string().optional().nullable(),
              descripcion: z.string().optional().nullable(),
            })
            .partial()
            .optional(),
          totebags: z
            .object({
              titulo: z.string().optional().nullable(),
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
});

export type Sections = z.infer<typeof SectionsSchema>;

// Products schema
export const RawProductSchema = z.object({
  nombre: z.string(),
  talles: z.array(z.enum(["XS", "S", "M", "L", "XL", "XXL"])).default([]),
  colores: z.array(z.string()).default([]),
  descripcion: z.string().default(""),
  precio: z.object({
    normal: z.number(),
    transferencia: z.number().optional(),
  }),
  metodos_pago: z.array(z.string()).optional().default([]),
  imagenes: z
    .array(z.object({ color: z.string(), url: z.string().url() }))
    .default([]),
  tamaño_estampa: z.record(z.string(), z.number()).default({}),
  envio: z.object({ metodo: z.string(), codigo_postal: z.string() }).optional(),
  stock: z
    .record(z.string(), z.record(z.string(), z.number().default(0)))
    .default({}),
});

export type RawProduct = z.infer<typeof RawProductSchema>;
