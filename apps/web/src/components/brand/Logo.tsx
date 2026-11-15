/* eslint-disable @next/next/no-img-element -- static SVG from the logo kit; next/image adds nothing here. */
import { cn } from "@virkum/ui";

/** Logo kit files with the built-in margin cropped (viewBox 441.68 × 119.2). */
const FILES = {
  colour: "/brand/virkum-logo.svg",
  onDark: "/brand/virkum-logo-on-dark.svg",
} as const;

const RATIO = 441.68 / 119.2;

type LogoProps = {
  /** "colour" for light backgrounds, "onDark" (white name) for dark ones. */
  variant?: keyof typeof FILES;
  /** Rendered height in px. Keep the logo at least 140px wide (≈38px high). */
  height?: number;
  className?: string;
  /** Hide from assistive tech when the same logo is already announced nearby. */
  decorative?: boolean;
};

/** The horizontal Virkum logo, always from the kit files (never redrawn). */
export function Logo({ variant = "colour", height = 40, className, decorative = false }: LogoProps) {
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
