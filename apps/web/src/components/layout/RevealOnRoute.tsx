"use client";

import { RevealObserver } from "@virkum/ui/client";
import { usePathname } from "next/navigation";

/** Scroll reveals for the whole site; rescans after every client-side navigation. */
export function RevealOnRoute() {
  return <RevealObserver watchKey={usePathname()} />;
}
