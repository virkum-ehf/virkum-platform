"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Logo } from "@/components/brand/Logo";
import { getPreferredLocale } from "@/i18n/preference";

export function LocaleRedirect() {
  const router = useRouter();

  useEffect(() => {
    const storedLocale = getPreferredLocale() ?? "is";
    const { search, hash } = window.location;
    router.replace(`/${storedLocale}/${search}${hash}`);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Logo height={44} className="animate-pulse motion-reduce:animate-none" />
    </div>
  );
}
