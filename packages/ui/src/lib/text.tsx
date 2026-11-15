import { Fragment, type ReactNode } from "react";

/** Initials for an avatar, e.g. "Helgi Þór Jónsson" → "HÞ". */
export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

/**
 * Keeps number ranges such as "60-minute" or "2–4 weeks" on one line by wrapping
 * them in a no-wrap span. The text itself is unchanged.
 */
export function noBreak(text: string): ReactNode {
  const parts = text.split(/(\S*\d[-–]\S+)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="nw">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Splits a "✓ Text" bullet into its tick and text; other strings are returned as they are. */
export function splitTick(text: string): { tick: boolean; text: string } {
  const match = text.match(/^✓\s*(.*)$/);
  return match ? { tick: true, text: match[1] ?? "" } : { tick: false, text };
}
