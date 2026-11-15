import { getBlogSlugs } from "@/content/blog";

import sitemap from "./sitemap";

describe("sitemap", () => {
  const entries = sitemap();

  it("lists every page in both languages", () => {
    expect(entries).toHaveLength((7 + getBlogSlugs().length) * 2);
    expect(entries.map((entry) => entry.url)).toContain("https://virkum.is/en/blogg/vikulegur-taktur/");
  });

  it("ranks the Icelandic home page highest and links the alternates", () => {
    const home = entries.find((entry) => entry.url === "https://virkum.is/is/");
    expect(home?.priority).toBe(1);
    expect(home?.alternates?.languages).toEqual({
      "is-IS": "https://virkum.is/is/",
      en: "https://virkum.is/en/",
      "x-default": "https://virkum.is/is/",
    });
  });
});
