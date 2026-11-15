import type { CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";

type CutCornerProps = {
  children: ReactNode;
  /** Size of the cut in px (the mint arrow scales with it). */
  size?: number;
  className?: string;
  bodyClassName?: string;
};

/**
 * The logo's cut corner (guide p.10 + p.21): the top-right corner is cut at 45°
 * and a mint arrow sits in the cut. Use it on one element per view.
 */
export function CutCorner({ children, size, className, bodyClassName }: CutCornerProps) {
  const style = size ? ({ "--cut": `${size}px` } as CSSProperties) : undefined;
  return (
    <div className={cn("cut", className)} style={style}>
      <div className={cn("cut-body", bodyClassName)}>{children}</div>
      <span className="cut-arrow" aria-hidden="true" />
    </div>
  );
}
