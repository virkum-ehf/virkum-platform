import { isActive, NAV_ITEMS, SERVICES_HASH } from "./navigation";

const item = (key: string) => {
  const found = NAV_ITEMS.find((candidate) => candidate.key === key);
  if (!found) throw new Error(key);
  return found;
};

describe("isActive", () => {
  it("marks Home on the home page unless Services is in view", () => {
    expect(isActive(item("home"), "/", "")).toBe(true);
    expect(isActive(item("home"), "/", SERVICES_HASH)).toBe(false);
    expect(isActive(item("services"), "/", SERVICES_HASH)).toBe(true);
  });

  it("marks a section and its sub-pages", () => {
    expect(isActive(item("blog"), "/blogg", "")).toBe(true);
    expect(isActive(item("blog"), "/blogg/vikulegur-taktur", "")).toBe(true);
    expect(isActive(item("cases"), "/blogg", "")).toBe(false);
  });
});
