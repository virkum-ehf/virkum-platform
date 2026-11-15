import { breadcrumbJsonLd, serializeJsonLd } from "./json-ld";
import { buildPageMetadata } from "./metadata";
import { blogFeedUrl, pageUrl } from "./urls";

describe("SEO helpers", () => {
  it("serializes JSON-LD so text in the data cannot close the script tag", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json)).toEqual({ name: "</script><script>alert(1)</script>" });
  });

  it("builds absolute URLs with the trailing slash the site uses", () => {
    expect(pageUrl("is", "/")).toBe("https://virkum.is/is/");
    expect(pageUrl("en", "/daemi")).toBe("https://virkum.is/en/daemi/");
    expect(blogFeedUrl("is")).toBe("https://virkum.is/is/blogg/feed.xml");
  });

  it("points canonical and hreflang alternates at both languages", () => {
    const metadata = buildPageMetadata("en", "/sjalfsmat", "Title", "Description");
    expect(metadata.alternates?.canonical).toBe("https://virkum.is/en/sjalfsmat/");
    expect(metadata.alternates?.languages).toEqual({
      "is-IS": "https://virkum.is/is/sjalfsmat/",
      en: "https://virkum.is/en/sjalfsmat/",
      "x-default": "https://virkum.is/is/sjalfsmat/",
    });
  });

  it("numbers breadcrumb items from 1", () => {
    const crumbs = breadcrumbJsonLd("is", [
      { name: "Heim", path: "/" },
      { name: "Blogg", path: "/blogg" },
    ]);
    expect(crumbs.itemListElement.map((entry) => [entry.position, entry.item])).toEqual([
      [1, "https://virkum.is/is/"],
      [2, "https://virkum.is/is/blogg/"],
    ]);
  });
});
