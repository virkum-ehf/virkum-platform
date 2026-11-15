import { type CSSProperties, Fragment } from "react";

import styles from "./RevealWords.module.css";

export const countWords = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

type RevealWordsProps = {
  text: string;
  /** Index of the first word, to continue the stagger across several calls. */
  offset?: number;
};

/**
 * Splits text into words that slide up one after another on load. Purely visual:
 * pair it with a visually hidden copy of the text for assistive technology.
 */
export function RevealWords({ text, offset = 0 }: RevealWordsProps) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className={styles.word}>
            <span style={{ "--wi": offset + i } as CSSProperties}>{word}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}
