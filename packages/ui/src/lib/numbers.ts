/**
 * Finds the first number in a display string ("1,592", "12,8%", "~ISK 50m/year") and
 * returns its value plus a formatter that writes any value back in the same format
 * (same thousands separator, decimal separator and number of decimals).
 */
export type ParsedNumber = {
  value: number;
  /** The original string with its number replaced by `value` in the same format. */
  format: (value: number) => string;
};

export function parseDisplayNumber(source: string): ParsedNumber | null {
  const match = source.match(/\d[\d.,]*/);
  if (!match) return null;
  const raw = match[0].replace(/[.,]$/, "");
  const lastSeparator = Math.max(raw.lastIndexOf(","), raw.lastIndexOf("."));

  // A separator followed by exactly three digits groups thousands; anything else is a decimal point.
  let decimalSeparator = "";
  let decimals = 0;
  if (lastSeparator >= 0 && raw.length - lastSeparator - 1 !== 3) {
    decimalSeparator = raw.charAt(lastSeparator);
    decimals = raw.length - lastSeparator - 1;
  }
  const integerPart = decimalSeparator ? raw.slice(0, lastSeparator) : raw;
  const thousandsSeparator = integerPart.match(/[.,]/)?.[0] ?? "";
  const value = parseFloat(
    integerPart.replace(/[.,]/g, "") + (decimalSeparator ? `.${raw.slice(lastSeparator + 1)}` : ""),
  );
  if (!Number.isFinite(value)) return null;

  const formatNumber = (v: number) => {
    const [integer = "", fraction] = v.toFixed(decimals).split(".");
    const grouped = thousandsSeparator ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator) : integer;
    return fraction ? grouped + decimalSeparator + fraction : grouped;
  };

  return { value, format: (v) => source.replace(raw, formatNumber(v)) };
}

/** Reads a ratio such as "12,8% → 15,8%" (Icelandic) or "12.8% → 15.8%" (English). */
export function parsePercent(text: string | undefined): number {
  const value = parseFloat(
    String(text ?? "")
      .replace(",", ".")
      .replace(/[^\d.]/g, ""),
  );
  return Number.isFinite(value) ? value : 0;
}
