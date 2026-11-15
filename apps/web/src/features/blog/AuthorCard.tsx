/* eslint-disable @next/next/no-img-element -- small static team photo from /public. */
import { cn } from "@virkum/ui";

import { AuthorBookingLink } from "./AuthorBookingLink";
import styles from "./BlogPost.module.css";

type AuthorCardProps = {
  author: { name: string; role: string; image: string };
  dates: { published: { iso: string; label: string }; updated?: { iso: string; label: string } };
  labels: { published: string; updated: string };
  button: string;
  className?: string;
};

/** Who wrote the article, when, and a way to book a call. */
export function AuthorCard({ author, dates, labels, button, className }: AuthorCardProps) {
  return (
    <div className={cn(styles.author, className)}>
      <div className={styles.me}>
        <img src={author.image} alt="" width={64} height={64} loading="lazy" decoding="async" />
        <div>
          <strong>{author.name}</strong>
          <p className={styles.role}>{author.role}</p>
        </div>
      </div>
      <dl>
        <div>
          <dt>{labels.published}</dt>
          <dd>
            <time dateTime={dates.published.iso}>{dates.published.label}</time>
          </dd>
        </div>
        {dates.updated ? (
          <div>
            <dt>{labels.updated}</dt>
            <dd>
              <time dateTime={dates.updated.iso}>{dates.updated.label}</time>
            </dd>
          </div>
        ) : null}
      </dl>
      <AuthorBookingLink>{button}</AuthorBookingLink>
    </div>
  );
}
