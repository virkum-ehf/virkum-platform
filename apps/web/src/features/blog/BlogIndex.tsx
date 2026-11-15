import { cn } from "@virkum/ui";

import type { BlogPost } from "@/content/blog";

import styles from "./BlogIndex.module.css";
import { BlogSearch } from "./BlogSearch";

type BlogIndexProps = {
  posts: BlogPost[];
  dateLabels: Record<string, string>;
  labels: {
    eyebrow: string;
    title: string;
    intro: string;
    read: string;
    search: string;
    empty: string;
    matchTitle: string;
    matchText: string;
  };
};

/** Blog landing: heading, search box and the article list. */
export function BlogIndex({ posts, dateLabels, labels }: BlogIndexProps) {
  return (
    <>
      <section className={cn("wrap", styles.head)}>
        <p className={cn("t-label", styles.enter)}>{labels.eyebrow}</p>
        <h1 className={cn("t-h1", styles.enter)}>{labels.title}</h1>
        <p className={cn("t-lead", styles.enter)}>{labels.intro}</p>
      </section>
      <section className={cn("wrap", styles.body)}>
        <BlogSearch
          posts={posts}
          readLabel={labels.read}
          searchLabel={labels.search}
          emptyLabel={labels.empty}
          dateLabels={dateLabels}
          matchTitleLabel={labels.matchTitle}
          matchTextLabel={labels.matchText}
        />
      </section>
    </>
  );
}
