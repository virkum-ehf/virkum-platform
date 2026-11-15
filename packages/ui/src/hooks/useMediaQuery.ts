"use client";

import { useSyncExternalStore } from "react";

/**
 * Live result of a CSS media query. `serverValue` is used while rendering on the
 * server and during hydration, so the first client render matches the static HTML.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Phones get smaller 3D scenes (matches the 760px breakpoint used by the scenes). */
export const COMPACT_QUERY = "(max-width: 759px)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
