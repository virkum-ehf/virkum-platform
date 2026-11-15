/** Main navigation, in display order. "services" is the #thjonusta section of the home page. */
export type RouteItem = {
  kind: "route";
  to: "/" | "/daemi" | "/sjalfsmat" | "/gervigreind" | "/blogg";
  key: "home" | "cases" | "selfAssessment" | "ai" | "blog";
};

export type ServiceItem = { kind: "services"; key: "services" };

export type NavItem = RouteItem | ServiceItem;

export const NAV_ITEMS: NavItem[] = [
  { kind: "route", to: "/", key: "home" },
  { kind: "services", key: "services" },
  { kind: "route", to: "/daemi", key: "cases" },
  { kind: "route", to: "/sjalfsmat", key: "selfAssessment" },
  { kind: "route", to: "/gervigreind", key: "ai" },
  { kind: "route", to: "/blogg", key: "blog" },
];

export const SERVICES_HASH = "#thjonusta";

/** Whether a nav item is the current page (same rules as before the redesign). */
export function isActive(item: NavItem, pathname: string, hash: string): boolean {
  if (item.kind === "services") return pathname === "/" && hash === SERVICES_HASH;
  if (item.to === "/") return pathname === "/" && hash !== SERVICES_HASH;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
