import { cn, Columns } from "@virkum/ui";
import NextLink from "next/link";

import styles from "./NotFound.module.css";

const MIST = "#DDE3EC";

export type NotFoundCopy = {
  code: string;
  title: string;
  description: string;
  homeLink: string;
};

type NotFoundViewProps = {
  copy: NotFoundCopy;
  /** Home page of the visitor's language, e.g. "/is/". */
  homeHref: string;
};

/**
 * 404: a row of columns with one missing (dashed outline), and a way home.
 * Takes its text as props, so it works inside the locale layout and in a global not-found page.
 */
export function NotFoundView({ copy, homeHref }: NotFoundViewProps) {
  return (
    <main className={styles.page}>
      <div className="wrap">
        <Columns
          heights={[64, 64, 64, 64, 64, 64, 64]}
          colors={[MIST, MIST, MIST, "transparent", MIST, MIST, MIST]}
          strokes={[undefined, undefined, undefined, "#9DB2FF"]}
          width={18}
          gap={8}
          rise
          className={cn("rise-now", styles.row)}
        />
        <p className={cn("t-label", styles.code)}>{copy.code}</p>
        <h1 className={cn("t-h1", styles.title)}>{copy.title}</h1>
        <p className={styles.description}>{copy.description}</p>
        <NextLink href={homeHref} className="btn btn-primary">
          {copy.homeLink}
        </NextLink>
      </div>
    </main>
  );
}
