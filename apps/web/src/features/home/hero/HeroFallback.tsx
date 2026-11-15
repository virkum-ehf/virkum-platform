import { cn, Columns } from "@virkum/ui";

/** Flat columns shown instead of the 3D field when WebGL is not available. */
export function HeroFallback({ className }: { className?: string }) {
  return (
    <Columns
      heights={[44, 52, 49, 62, 70, 66, 84, 96, 136]}
      colors={["#2A3C93", "#2D44A3", "#2D44A3", "#3150B8", "#3150B8", "#3150B8", "#3559D0", "#3A62E6", "#2EE6A8"]}
      width={30}
      gap={10}
      rise
      late={{ 8: 300 }}
      className={cn("rise-now", className)}
    />
  );
}
