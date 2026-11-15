import type { BlogPost } from "@/content/blog";

export type BlogMatch = "title" | "text";

/**
 * Case- and accent-insensitive form of a string, so "radgjof" finds "ráðgjöf".
 * Icelandic letters without a base letter are spelled out: ð → d, þ → th, æ → ae.
 */
export function fold(value: string): string {
  return value
    .toLocaleLowerCase("is-IS")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replaceAll("ð", "d")
    .replaceAll("þ", "th")
    .replaceAll("æ", "ae");
}

/** Everything searchable in an article apart from its title. */
function articleText(post: BlogPost): string {
  const body = post.sections
    .map((section) => (section.type === "ul" ? section.items.join(" ") : section.text))
    .join(" ");
  return [post.description, post.tags.join(" "), body].join(" ");
}

export type IndexedPost = { post: BlogPost; title: string; text: string };

export function indexPosts(posts: BlogPost[]): IndexedPost[] {
  return posts.map((post) => ({ post, title: fold(post.title), text: fold(articleText(post)) }));
}

export type SearchResult = { post: BlogPost; match?: BlogMatch };

/** Posts matching the query; title matches come first. An empty query lists every post. */
export function search(index: IndexedPost[], query: string): SearchResult[] {
  const needle = fold(query.trim());
  if (!needle) return index.map(({ post }) => ({ post }));
  return index
    .flatMap((item): SearchResult[] => {
      if (item.title.includes(needle)) return [{ post: item.post, match: "title" }];
      if (item.text.includes(needle)) return [{ post: item.post, match: "text" }];
      return [];
    })
    .sort((a, b) => Number(a.match !== "title") - Number(b.match !== "title"));
}
