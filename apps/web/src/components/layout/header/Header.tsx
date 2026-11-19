"use client";

import { cn } from "@virkum/ui";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { BookingLink } from "@/components/BookingLink";
import { Logo } from "@/components/brand/Logo";
import { Link, usePathname } from "@/i18n/navigation";

import styles from "./Header.module.css";
import { LanguageSwitch } from "./LanguageSwitch";
import { isActive, NAV_ITEMS, type NavItem, SERVICES_HASH } from "./navigation";

/** A page section with this attribute has a dark background; the header is transparent over it. */
const DARK_HERO_SELECTOR = "[data-header-overlay]";

/** Re-reads the address on hash changes and back/forward navigation. */
function subscribeToLocation(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

export function Header() {
  const t = useTranslations("header");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const hash = useSyncExternalStore(
    subscribeToLocation,
    () => window.location.hash,
    () => "",
  );
  const search = useSyncExternalStore(
    subscribeToLocation,
    () => window.location.search,
    () => "",
  );
  // "Services" scrolls on the home page and keeps the query string when it leaves another page.
  const serviceHref = pathname === "/" ? SERVICES_HASH : `/${locale}/${search}${SERVICES_HASH}`;

  // Navigating closes the menu (state adjusted during render, as React recommends).
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  const close = useCallback(() => setOpen(false), []);

  // Cover the hero with a solid bar once the page scrolls; turn white after the hero leaves.
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(DARK_HERO_SELECTOR);
    let frame = 0;
    const sync = () => {
      frame = 0;
      setScrolled(window.scrollY > 4);
      const header = headerRef.current;
      setOverDark(!!hero && !!header && hero.getBoundingClientRect().bottom > header.offsetHeight + 1);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Mobile menu: close on outside press or Escape, lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        const sheet = document.getElementById("site-menu");
        if (!sheet?.contains(event.target as Node)) setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Leaving the mobile layout closes the menu.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1080px)");
    const onChange = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  const renderItem = (item: NavItem, mobile: boolean) => {
    const active = isActive(item, pathname, hash);
    const className = mobile ? styles.menuItem : styles.navItem;
    const label = (
      <>
        {t(item.key)}
        {mobile && <span aria-hidden="true">→</span>}
      </>
    );
    if (item.kind === "services") {
      return (
        <a
          key={item.key}
          href={serviceHref}
          onClick={close}
          className={className}
          aria-current={active ? "page" : undefined}
        >
          {label}
        </a>
      );
    }
    return (
      <Link
        key={item.to}
        href={item.to}
        onClick={close}
        className={className}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  const transparent = overDark && !open;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          styles.header,
          scrolled && styles.scrolled,
          transparent && styles.overDark,
          open && styles.menuOpen,
        )}
      >
        <div className={cn("wrap", styles.inner)}>
          <Link href="/" className={styles.brand} onClick={close} aria-label="Virkum">
            <Logo variant="colour" className={styles.logoLight} decorative />
            <Logo variant="onDark" className={styles.logoDark} decorative />
          </Link>

          <nav className={styles.nav}>{NAV_ITEMS.map((item) => renderItem(item, false))}</nav>

          <div className={styles.actions}>
            <LanguageSwitch />
            <BookingLink className={cn("btn btn-sm btn-secondary", styles.cta)}>{tCommon("bookCall")}</BookingLink>
          </div>

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      <div id="site-menu" className={cn(styles.sheet, open && styles.sheetOpen)} hidden={!open}>
        <nav>{NAV_ITEMS.map((item) => renderItem(item, true))}</nav>
        <div className={styles.menuFoot}>
          <LanguageSwitch onSwitch={close} />
          <BookingLink className="btn btn-primary btn-block" onClick={close}>
            {tCommon("bookCall")}
          </BookingLink>
        </div>
      </div>
    </>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
