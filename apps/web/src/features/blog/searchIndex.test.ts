import type { BlogPost } from "@/content/blog";

import { fold, indexPosts, search } from "./searchIndex";

const post = (slug: string, title: string, text: string): BlogPost => ({
  slug,
  title,
  description: "",
  publishedAt: "2026-11-11",
  updatedAt: "2026-11-11",
  tags: [],
  sections: [{ type: "p", text }],
  links: [],
});

const posts = [
  post("a", "Vikulegur taktur", "Fundur með tölum og ráðgjöf."),
  post("b", "Gervigreind án gagnaleka", "Stefna um gervigreind í rekstri."),
  post("c", "Þjónusta og rekstur", "Ekkert um vikulegan takt."),
];

describe("fold", () => {
  it("ignores case and Icelandic accents", () => {
    expect(fold("Ráðgjöf")).toBe(fold("radgjof"));
    expect(fold("Þjónusta")).toBe(fold("thjonusta"));
    expect(fold("Æfing")).toBe(fold("aefing"));
  });
});

describe("search", () => {
  const index = indexPosts(posts);

  it("returns every post for an empty query", () => {
    expect(search(index, "  ")).toHaveLength(3);
  });

  it("matches words without accents", () => {
    expect(search(index, "radgjof").map((result) => result.post.slug)).toEqual(["a"]);
  });

  it("ranks title matches before text matches", () => {
    const results = search(index, "gervigreind");
    expect(results.map((result) => [result.post.slug, result.match])).toEqual([["b", "title"]]);
    const takt = search(index, "takt");
    expect(takt[0]?.match).toBe("title");
  });

  it("returns nothing for unknown words", () => {
    expect(search(index, "zzqx")).toEqual([]);
  });
});
