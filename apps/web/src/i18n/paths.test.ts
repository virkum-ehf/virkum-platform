import { localizedPath } from "./paths";

describe("localizedPath", () => {
  it.each([
    ["/en/", "", "", "is", "/is/"],
    ["/is", "", "", "en", "/en/"],
    ["/en/daemi/", "", "", "is", "/is/daemi/"],
    ["/is/blogg/vikulegur-taktur", "", "", "en", "/en/blogg/vikulegur-taktur/"],
    ["/en/sjalfsmat/", "?utm_source=x", "#quiz", "is", "/is/sjalfsmat/?utm_source=x#quiz"],
  ] as const)("%s%s%s → %s", (pathname, search, hash, target, expected) => {
    expect(localizedPath(target, { pathname, search, hash })).toBe(expected);
  });
});
