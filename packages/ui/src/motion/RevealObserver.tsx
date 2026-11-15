"use client";

import { useEffect } from "react";

/** Set on an element once it has been revealed. An attribute, not a class: React rewrites
 * `className` when a component re-renders, but it never removes attributes it did not set. */
export const REVEALED_ATTRIBUTE = "data-in";

const PENDING = `.reveal:not([${REVEALED_ATTRIBUTE}]), .rise:not([${REVEALED_ATTRIBUTE}])`;

type RevealObserverProps = {
  /** Changes on client-side navigation (e.g. the pathname), so new pages are scanned. */
  watchKey?: string;
};

/**
 * Marks `.reveal` and `.rise` elements with `data-in` as they scroll into view (see motion.css).
 * Watches the whole document, including content added later (search results, route changes),
 * so server components only need the class names.
 */
export function RevealObserver({ watchKey }: RevealObserverProps) {
  useEffect(() => {
    const show = (element: Element) => element.setAttribute(REVEALED_ATTRIBUTE, "");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intersection =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, observer) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                show(entry.target);
                observer.unobserve(entry.target);
              }
            },
            { rootMargin: "0px 0px -8% 0px" },
          )
        : null;

    const scan = () => {
      document.querySelectorAll(PENDING).forEach((element) => {
        if (reduced || !intersection) show(element);
        else intersection.observe(element);
      });
    };
    scan();

    let frame = 0;
    const mutations = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersection?.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [watchKey]);

  return null;
}
