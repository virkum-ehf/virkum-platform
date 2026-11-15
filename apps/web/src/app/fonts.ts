import { Inter, Manrope } from "next/font/google";

/** Headings (identity guide p.20). Exposed as --font-manrope; the design system maps it to --font-display. */
export const displayFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

/** Text and interface. Exposed as --font-inter; the design system maps it to --font-sans. */
export const textFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const fontVariables = `${displayFont.variable} ${textFont.variable}`;
