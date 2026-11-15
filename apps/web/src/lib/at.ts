/**
 * The item at `index`, for lists whose length is guaranteed by the content (for example the
 * five self-assessment questions). Throws on a programming error instead of returning undefined.
 */
export function at<T>(items: readonly T[], index: number): T {
  const item = items[index];
  if (item === undefined) throw new RangeError(`No item at index ${index} (list has ${items.length})`);
  return item;
}
