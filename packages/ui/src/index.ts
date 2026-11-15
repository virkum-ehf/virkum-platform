/**
 * @virkum/ui — server-safe exports. Client-only pieces (scroll observers, counters, hooks)
 * are in "@virkum/ui/client". Styles: import "@virkum/ui/styles.css" after Tailwind.
 */
export { Arrow } from "./components/Arrow";
export { Columns } from "./components/Columns";
export { CutCorner } from "./components/CutCorner";
export { PageHead } from "./components/PageHead/PageHead";
export { countWords, RevealWords } from "./components/RevealWords/RevealWords";
export { cn } from "./lib/cn";
export { clamp01, easeOutCubic } from "./lib/easing";
export { parseDisplayNumber, type ParsedNumber, parsePercent } from "./lib/numbers";
export { initials, noBreak, splitTick } from "./lib/text";
