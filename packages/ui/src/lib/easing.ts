/** Small animation helpers (the 3D engine has its own copy so the packages stay independent). */
export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const easeOutCubic = (k: number): number => 1 - Math.pow(1 - k, 3);
