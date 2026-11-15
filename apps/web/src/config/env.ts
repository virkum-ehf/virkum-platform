import { z } from "zod";

/**
 * Public build-time configuration, validated once. A bad value fails the build instead of
 * shipping a broken page. Next.js inlines `process.env.NEXT_PUBLIC_*` at build time, so each
 * variable must be read explicitly here.
 */
const schema = z.object({
  /** Google Analytics 4; loaded only after the visitor accepts cookies. */
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, "Expected a GA4 measurement id such as G-XXXXXXX")
    .default("G-0K812W2N8F"),
  /** Meta Pixel; off unless a numeric pixel id is set. */
  NEXT_PUBLIC_META_PIXEL_ID: z
    .string()
    .regex(/^\d{5,20}$/, "Expected a numeric Meta Pixel id")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export const env = schema.parse({
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined,
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim(),
});
