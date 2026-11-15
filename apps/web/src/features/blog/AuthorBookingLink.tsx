"use client";

import { cn } from "@virkum/ui";
import { type ReactNode, useEffect, useState } from "react";

import { BookingLink } from "@/components/BookingLink";

import { ARTICLE_CTA_ATTRIBUTE } from "./articleCta";

/**
 * The author card's booking button. One filled button per view: while the article's
 * call-to-action panel is on screen, this button steps back to the outlined style.
 */
export function AuthorBookingLink({ children }: { children: ReactNode }) {
  const [stepBack, setStepBack] = useState(false);

  useEffect(() => {
    const target = document.querySelector(`[${ARTICLE_CTA_ATTRIBUTE}]`);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setStepBack(entry?.isIntersecting ?? false));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <BookingLink className={cn("btn btn-block", stepBack ? "btn-secondary" : "btn-primary")}>{children}</BookingLink>
  );
}
