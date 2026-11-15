"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type { BlogPost } from "@/content/blog";

import { BlogList } from "./BlogList";
import styles from "./BlogSearch.module.css";
import { indexPosts, search } from "./searchIndex";

export type { BlogMatch } from "./searchIndex";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type BlogSearchProps = {
  posts: BlogPost[];
  readLabel: string;
  searchLabel: string;
  emptyLabel: string;
  dateLabels: Record<string, string>;
  matchTitleLabel: string;
  matchTextLabel: string;
};

/**
 * Search box over the article list. Results re-order as you type; rows slide to their
 * new place (FLIP with the Web Animations API) instead of jumping.
 */
export function BlogSearch({
  posts,
  readLabel,
  searchLabel,
  emptyLabel,
  dateLabels,
  matchTitleLabel,
  matchTextLabel,
}: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  /** Row positions just before the last change ("First" in FLIP). */
  const before = useRef<Map<string, number> | null>(null);
  const index = useMemo(() => indexPosts(posts), [posts]);
  const results = search(index, query);
  const order = results.map(({ post, match }) => `${post.slug}:${match ?? ""}`).join("|");

  const measure = () => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("li[data-slug]") ?? [];
    before.current = new Map([...rows].map((row) => [row.dataset.slug ?? "", row.getBoundingClientRect().top]));
  };

  // "Last, Invert, Play": rows that moved slide from where they were; new rows fade up.
  useLayoutEffect(() => {
    const previous = before.current;
    before.current = null;
    const host = listRef.current;
    if (!previous || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    host.querySelectorAll<HTMLElement>("li[data-slug]").forEach((row, i) => {
      const top = previous.get(row.dataset.slug ?? "");
      if (top === undefined) {
        row.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 420,
            delay: i * 40,
            easing: EASE,
            fill: "backwards",
          },
        );
        return;
      }
      const dy = top - row.getBoundingClientRect().top;
      if (Math.abs(dy) > 1) {
        row.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 520, easing: EASE });
      }
    });
  }, [order]);

  return (
    <>
      <form role="search" className={styles.search} onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="blog-search" className="sr-only">
          {searchLabel}
        </label>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
          <path d="M16 16.5L20 20.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => {
            measure();
            setQuery(event.target.value);
          }}
          placeholder={searchLabel}
          autoComplete="off"
          className={styles.input}
        />
      </form>
      <div ref={listRef}>
        {results.length > 0 ? (
          <BlogList
            results={results}
            readLabel={readLabel}
            dateLabels={dateLabels}
            matchTitleLabel={matchTitleLabel}
            matchTextLabel={matchTextLabel}
          />
        ) : (
          <p role="status" className={styles.empty}>
            {emptyLabel}
          </p>
        )}
      </div>
    </>
  );
}
