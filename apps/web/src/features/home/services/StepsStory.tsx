"use client";

import { clamp01 } from "@virkum/basalt/math";
import { useBasaltScene } from "@virkum/basalt/react";
import type { StepsController } from "@virkum/basalt/types";
import { cn, Columns, CutCorner, noBreak } from "@virkum/ui";
import { useMediaQuery } from "@virkum/ui/client";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { BookingLink } from "@/components/BookingLink";

import styles from "./Services.module.css";

export type Step = {
  step: string;
  name: string;
  sub: string;
  body: string;
  duration: string;
  featured?: boolean;
};

type StepsStoryProps = {
  items: Step[];
  labels: { featured: string; duration: string; book: string };
  head: ReactNode;
};

/** Desktop pins the section and lets scrolling move through the steps (see Services.module.css). */
const PINNED_QUERY = "(min-width: 1080px)";

export function StepsStory({ items, labels, head }: StepsStoryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const bodyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pinned = useMediaQuery(PINNED_QUERY);
  const [active, setActive] = useState(0);
  const count = items.length;

  const { status, controllerRef } = useBasaltScene<StepsController>(
    hostRef,
    async (host, signal) => {
      const { mountStepsScene } = await import("@virkum/basalt/scenes/steps");
      if (signal.aborted) return null;
      return mountStepsScene(host);
    },
    { lazyMargin: "600px" },
  );

  // The 3D panel follows the active step.
  useEffect(() => {
    controllerRef.current?.setStep(active);
  }, [active, status, controllerRef]);

  // Pinned: the scroll position through the track picks the step.
  useEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const progress = clamp01(-rect.top / Math.max(1, rect.height - window.innerHeight));
      setActive(Math.min(count - 1, Math.floor(progress * count)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [pinned, count]);

  // Not pinned: every step is open and the one in the middle of the screen is active.
  useEffect(() => {
    if (pinned) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = itemRefs.current.indexOf(entry.target as HTMLLIElement);
          if (index >= 0) setActive(index);
        }),
      { rootMargin: "-40% 0px -40% 0px" },
    );
    itemRefs.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, [pinned]);

  // Collapsed steps cannot be tabbed into.
  useEffect(() => {
    bodyRefs.current.forEach((body, i) => {
      if (body) body.inert = pinned && i !== active;
    });
  }, [pinned, active]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!pinned || !track) return;
    const rect = track.getBoundingClientRect();
    const top = window.scrollY + rect.top + (rect.height - window.innerHeight) * ((index + 0.5) / count);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div ref={trackRef} className={styles.track}>
      <div className={styles.sticky}>
        <div className={cn("wrap", styles.grid)}>
          {head}

          <div className={cn(styles.visual, "reveal")}>
            <CutCorner className={styles.panel} bodyClassName={styles.panelBody}>
              <div ref={hostRef} className={styles.field} aria-hidden="true" />
              {status === "failed" && <StepsFallback />}
            </CutCorner>
            <div className={styles.progress} aria-hidden="true">
              {items.map((item, i) => (
                <i key={item.step} className={cn(i <= active && styles.on)} />
              ))}
            </div>
          </div>

          <ol className={styles.stepper}>
            {items.map((item, i) => (
              <li
                key={item.step}
                ref={(element) => {
                  itemRefs.current[i] = element;
                }}
                className={cn(styles.item, i === active && styles.active)}
              >
                <button
                  type="button"
                  className={styles.stepHead}
                  aria-expanded={pinned ? i === active : true}
                  aria-controls={`service-step-${i}`}
                  onClick={() => goTo(i)}
                >
                  <span className={cn("t-label", styles.stepNo)}>{item.step}</span>
                  <span className={styles.name}>{item.name}</span>
                  {item.featured && <span className={cn("t-label", styles.flag)}>{labels.featured}</span>}
                </button>
                <div
                  id={`service-step-${i}`}
                  ref={(element) => {
                    bodyRefs.current[i] = element;
                  }}
                  className={styles.body}
                >
                  <div>
                    <p className={styles.sub}>{item.sub}</p>
                    <p className={styles.text}>{noBreak(item.body)}</p>
                    <dl className={styles.meta}>
                      <dt>{labels.duration}</dt>
                      <dd className="num">{item.duration}</dd>
                    </dl>
                    <BookingLink className={item.featured ? "btn btn-primary" : "link"}>{labels.book}</BookingLink>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/** Flat columns when WebGL is not available. */
function StepsFallback() {
  return (
    <Columns
      heights={[40, 58, 50, 72, 64, 88, 80, 104, 140]}
      colors={["#2A3C93", "#2D44A3", "#2D44A3", "#3150B8", "#3150B8", "#3559D0", "#3559D0", "#3A62E6", "#2EE6A8"]}
      width={30}
      gap={10}
      rise
      late={{ 8: 300 }}
      className={cn("rise-now", styles.fallback)}
    />
  );
}
