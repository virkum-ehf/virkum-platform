"use client";

import dynamic from "next/dynamic";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

import { MetaPixel } from "@/components/analytics/MetaPixel";

export const COOKIE_CONSENT_STORAGE_KEY = "virkum-cookie-consent";
const CONSENT_CHANGE_EVENT = "virkum:consent-change";

type Choice = "accepted" | "rejected";

export type ConsentState =
  { status: "loading" } | { status: "needs-choice" } | { status: "accepted" } | { status: "rejected" };

type CookieConsentContextValue = {
  consent: ConsentState;
  saveConsent: (choice: Choice) => void;
};

const GoogleAnalytics = dynamic(() => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics), {
  ssr: false,
});

/** The choice for this page view when storage is unavailable (private mode, quota). */
let memoryChoice: Choice | null = null;

function readChoice(): ConsentState["status"] {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") return stored;
  } catch {
    /* storage blocked */
  }
  return memoryChoice ?? "needs-choice";
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  };
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);
  if (!context) throw new Error("useCookieConsent must be used within ConsentProvider.");
  return context;
}

/**
 * Cookie consent, stored in localStorage (also synced across tabs). Google Analytics loads
 * only after the visitor accepts; until the choice is known, the status is "loading".
 */
type ConsentProviderProps = {
  children: ReactNode;
  gaMeasurementId: string;
  /** Meta Pixel id; the pixel is off when it is not set. */
  metaPixelId?: string | undefined;
};

export function ConsentProvider({ children, gaMeasurementId, metaPixelId }: ConsentProviderProps) {
  const status = useSyncExternalStore(subscribe, readChoice, () => "loading" as const);

  const saveConsent = useCallback((choice: Choice) => {
    memoryChoice = choice;
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
    } catch {
      /* quota / private mode: the in-memory choice applies to this page view */
    }
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ consent: { status }, saveConsent }), [status, saveConsent]);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {status === "accepted" ? (
        <>
          <GoogleAnalytics gaId={gaMeasurementId} />
          {metaPixelId ? <MetaPixel pixelId={metaPixelId} /> : null}
        </>
      ) : null}
    </CookieConsentContext.Provider>
  );
}
