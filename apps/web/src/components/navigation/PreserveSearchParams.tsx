"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Keeps the current query string (UTM and other campaign params) on in-site
 * navigations. The listener runs in the capture phase and only rewrites the
 * URL at click time, so server and client markup stay the same.
 */
export function PreserveSearchParams() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const current = new URLSearchParams(window.location.search);
      if ([...current.keys()].length === 0) return;

      const next = new URLSearchParams(url.search);
      let changed = false;
      current.forEach((value, key) => {
        if (!next.has(key)) {
          next.append(key, value);
          changed = true;
        }
      });
      if (!changed) return;

      event.preventDefault();
      event.stopPropagation();
      const search = next.toString();
      router.push(`${url.pathname}${search ? `?${search}` : ""}${url.hash}`);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
