import { Arrow, cn, CutCorner } from "@virkum/ui";
import { ReadingProgress } from "@virkum/ui/client";

import { BookingLink } from "@/components/BookingLink";
import type { BlogPost as BlogPostData, BlogSection } from "@/content/blog";
import { getBlogPosts } from "@/content/blog";
import { Link } from "@/i18n/navigation";
import { blogPostingJsonLd } from "@/lib/seo/json-ld";

import { ARTICLE_CTA_ATTRIBUTE } from "./articleCta";
import { AuthorCard } from "./AuthorCard";
import styles from "./BlogPost.module.css";

function formatDate(locale: string, value: string) {
  return new Intl.DateTimeFormat(locale === "is" ? "is-IS" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function Section({ section }: { section: BlogSection }) {
  if (section.type === "h2") return <h2>{section.text}</h2>;
  if (section.type === "ul") {
    return (
      <ul>
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{section.text}</p>;
}

type BlogPostProps = {
  locale: string;
  post: BlogPostData;
  labels: {
    back: string;
    published: string;
    updated: string;
    related: string;
    read: string;
  };
  author: { name: string; role: string; image: string };
  cta: { titleLine1: string; titleLine2: string; body: string; button: string };
};

/** An article: text on the left, author card on the right (above the text on smaller screens). */
export function BlogPost({ locale, post, labels, author, cta }: BlogPostProps) {
  const related = getBlogPosts(locale)
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);
  const dates = {
    published: { iso: post.publishedAt, label: formatDate(locale, post.publishedAt) },
    updated:
      post.updatedAt !== post.publishedAt
        ? { iso: post.updatedAt, label: formatDate(locale, post.updatedAt) }
        : undefined,
  };
  const authorCard = (className: string) => (
    <AuthorCard author={author} dates={dates} labels={labels} button={cta.button} className={className} />
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(locale, post)) }}
      />
      <ReadingProgress />
      <div className={cn("wrap", styles.grid)}>
        <article className={styles.main}>
          <Link href="/blogg" className={cn(styles.back, styles.enter)}>
            {labels.back}
          </Link>
          <header className={styles.head}>
            <h1 className={styles.enter}>{post.title}</h1>
            <p className={cn("t-lead", styles.enter)}>{post.description}</p>
          </header>

          {authorCard(cn(styles.authorInline, styles.enter))}

          <div className={cn(styles.prose, "reveal")}>
            {post.sections.map((section, index) => (
              <Section key={index} section={section} />
            ))}
          </div>

          {post.links.length > 0 ? (
            <div className={styles.further}>
              {post.links.map((link) => (
                <Link key={link.href} href={link.href} className="link">
                  {link.label}
                  <Arrow />
                </Link>
              ))}
            </div>
          ) : null}

          <CutCorner className={cn(styles.cta, "reveal")} bodyClassName={cn(styles.ctaBody, "on-dark")}>
            <h2>
              {cta.titleLine1}
              <br />
              {cta.titleLine2}
            </h2>
            <p>{cta.body}</p>
            <BookingLink className="btn btn-mint" {...{ [ARTICLE_CTA_ATTRIBUTE]: "" }}>
              {cta.button}
            </BookingLink>
          </CutCorner>

          {related.length > 0 ? (
            <aside className={styles.related}>
              <h2>{labels.related}</h2>
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={{ pathname: "/blogg/[slug]", params: { slug: item.slug } }}
                  className={styles.relatedItem}
                >
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                  <span className={cn("link", styles.relatedRead)}>
                    {labels.read}
                    <Arrow />
                  </span>
                </Link>
              ))}
            </aside>
          ) : null}
        </article>

        <aside className={styles.aside}>{authorCard(cn(styles.authorSticky, styles.enter))}</aside>
      </div>
    </>
  );
}
