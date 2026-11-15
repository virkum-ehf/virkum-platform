import { Arrow, cn } from "@virkum/ui";

import { Link } from "@/i18n/navigation";

import styles from "./BlogList.module.css";
import type { SearchResult } from "./searchIndex";

type BlogListProps = {
  results: SearchResult[];
  readLabel: string;
  dateLabels: Record<string, string>;
  matchTitleLabel: string;
  matchTextLabel: string;
};

/** Article rows: date (and where the search matched) on the left, title and summary on the right. */
export function BlogList({ results, readLabel, dateLabels, matchTitleLabel, matchTextLabel }: BlogListProps) {
  return (
    <ul className={styles.posts}>
      {results.map(({ post, match }) => {
        const href = { pathname: "/blogg/[slug]", params: { slug: post.slug } } as const;
        return (
          <li key={post.slug} data-slug={post.slug}>
            <article className={styles.post}>
              <div className={styles.meta}>
                <time dateTime={post.publishedAt}>{dateLabels[post.slug]}</time>
                {match ? (
                  <span className={cn(styles.match, match === "title" && styles.matchTitle)}>
                    {match === "title" ? matchTitleLabel : matchTextLabel}
                  </span>
                ) : null}
              </div>
              <div className={styles.content}>
                <h2>
                  <Link href={href}>{post.title}</Link>
                </h2>
                <p>{post.description}</p>
                <Link href={href} className="link">
                  {readLabel}
                  <Arrow />
                </Link>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
