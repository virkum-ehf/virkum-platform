/* eslint-disable @next/next/no-img-element -- static SVG from the logo kit; next/image adds nothing here. */
import { cn } from "@virkum/ui";

/**
 * Logo kit files cropped to the tile, which is as tall as the logo (viewBox 441.68 × 93.6).
 * The i has its plain round dot; the geyser bubbles above it were removed.
 */
const FILES = {
  colour: "/brand/virkum-logo.svg",
  onDark: "/brand/virkum-logo-on-dark.svg",
} as const;

const RATIO = 441.68 / 93.6;

type LogoProps = {
  /** "colour" for light backgrounds, "onDark" (white name) for dark ones. */
  variant?: keyof typeof FILES;
  /** Rendered height in px. Keep the logo at least 140px wide (≈30px high). */
  height?: number;
  className?: string;
  /** Hide from assistive tech when the same logo is already announced nearby. */
  decorative?: boolean;
};

/** The horizontal Virkum logo, always from the kit files (never redrawn). */
export function Logo({ variant = "colour", height = 32, className, decorative = false }: LogoProps) {
  return (
    <img
      src={FILES[variant]}
      alt={decorative ? "" : "Virkum"}
      aria-hidden={decorative || undefined}
      width={Math.round(height * RATIO)}
      height={height}
      className={cn("block h-auto max-w-none", className)}
      decoding="async"
    />
  );
}
