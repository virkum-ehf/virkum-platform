"use client";

import { type RefObject, useEffect, useEffectEvent, useRef, useState } from "react";

import { CONTEXT_LOST_EVENT } from "../engine/constants";
import type { SceneController } from "../types";

export type SceneStatus = "loading" | "ready" | "failed";

type Options = {
  /** Changing this rebuilds the scene (for example when crossing the phone breakpoint). */
  key?: string | number;
  /**
   * Start loading only when the host comes this close to the viewport (a CSS margin such as
   * "600px"). Use it for scenes far down the page, so visitors who never scroll there do not
   * download Three.js or create a WebGL context for them.
   */
  lazyMargin?: string;
};

/**
 * Mounts a 3D scene into `hostRef` on the client.
 *
 * `mount` should load its scene with a dynamic `import()`, so Three.js stays out of the initial
 * JavaScript, and return `null` if `signal` was aborted while it loaded (the scene is no longer
 * wanted). The scene is disposed on unmount and when `key` changes, which keeps client-side
 * navigation free of leaked WebGL contexts. If WebGL is missing or the context is lost, the
 * status becomes "failed" and the caller shows its fallback.
 */
export function useBasaltScene<C extends SceneController>(
  hostRef: RefObject<HTMLElement | null>,
  mount: (host: HTMLElement, signal: AbortSignal) => Promise<C | null>,
  { key, lazyMargin }: Options = {},
): { status: SceneStatus; controllerRef: RefObject<C | null> } {
  const [status, setStatus] = useState<SceneStatus>("loading");
  const controllerRef = useRef<C | null>(null);
  // Always calls the latest `mount` without making it an effect dependency.
  const mountScene = useEffectEvent((host: HTMLElement, signal: AbortSignal) => mount(host, signal));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const abort = new AbortController();
    let controller: C | null = null;

    const onLost = () => {
      controller?.dispose();
      controller = null;
      controllerRef.current = null;
      setStatus("failed");
    };
    host.addEventListener(CONTEXT_LOST_EVENT, onLost);

    const start = () => {
      mountScene(host, abort.signal)
        .then((created) => {
          if (abort.signal.aborted) {
            created?.dispose();
            return;
          }
          controller = created;
          controllerRef.current = created;
          setStatus(created ? "ready" : "failed");
        })
        .catch(() => {
          if (!abort.signal.aborted) setStatus("failed");
        });
    };

    let observer: IntersectionObserver | undefined;
    if (lazyMargin && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          start();
        },
        { rootMargin: lazyMargin },
      );
      observer.observe(host);
    } else {
      start();
    }

    return () => {
      abort.abort();
      observer?.disconnect();
      host.removeEventListener(CONTEXT_LOST_EVENT, onLost);
      controller?.dispose();
      controllerRef.current = null;
    };
  }, [hostRef, key, lazyMargin]);

  return { status, controllerRef };
}
