import en from "./en.json";
import is from "./is.json";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Every key path, with array lengths, so both languages must have the same shape. */
function shape(value: Json, path = ""): string[] {
  if (Array.isArray(value))
    return [`${path}[${value.length}]`, ...value.flatMap((item, i) => shape(item, `${path}[${i}]`))];
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => [
      path ? `${path}.${key}` : key,
      ...shape(child, path ? `${path}.${key}` : key),
    ]);
  }
  return [];
}

function strings(value: Json, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${path}[${i}]`));
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => strings(child, path ? `${path}.${key}` : key));
  }
  return [];
}

describe("translations", () => {
  it("Icelandic and English have exactly the same keys and list lengths", () => {
    expect(shape(is as Json)).toEqual(shape(en as Json));
  });

  it("every Icelandic string that has text in English has text too", () => {
    const icelandic = new Map(strings(is as Json));
    const missing = strings(en as Json)
      .filter(([path, text]) => text.trim() !== "" && (icelandic.get(path) ?? "").trim() === "")
      .map(([path]) => path);
    expect(missing).toEqual([]);
  });
});
