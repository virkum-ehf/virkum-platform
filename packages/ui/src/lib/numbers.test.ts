import { parseDisplayNumber, parsePercent } from "./numbers";

describe("parseDisplayNumber", () => {
  it.each([
    ["1,592", 1592, "0", "1,592"],
    ["1.592", 1592, "0", "1.592"],
    ["12.8%", 12.8, "0.0%", "12.8%"],
    ["12,8%", 12.8, "0,0%", "12,8%"],
    ["ISK 50m/year", 50, "ISK 0m/year", "ISK 50m/year"],
    ["~50 m.kr./ár", 50, "~0 m.kr./ár", "~50 m.kr./ár"],
    ["390k", 390, "0k", "390k"],
  ])("reads %s and writes values back in the same format", (source, value, atZero, atValue) => {
    const parsed = parseDisplayNumber(source);
    expect(parsed?.value).toBe(value);
    expect(parsed?.format(0)).toBe(atZero);
    expect(parsed?.format(value)).toBe(atValue);
  });

  it("returns null when there is no number", () => {
    expect(parseDisplayNumber("no figures here")).toBeNull();
  });
});

describe("parsePercent", () => {
  it("reads Icelandic and English decimals", () => {
    expect(parsePercent("12,8%")).toBe(12.8);
    expect(parsePercent("15.8%")).toBe(15.8);
    expect(parsePercent(undefined)).toBe(0);
  });
});
