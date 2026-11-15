import { Arrow, cn, CutCorner } from "@virkum/ui";
import { CountUp } from "@virkum/ui/client";
import { getMessages, getTranslations } from "next-intl/server";

import { BookingLink } from "@/components/BookingLink";

import styles from "./Courses.module.css";

type Course = {
  title: string;
  duration: string;
  price: string;
  description: string;
  markhopur: string;
  innihald: string;
};

type Metric = { number: string; label: string };

type CoursesMessages = { courses: Course[]; metrics: Metric[] };

/** /namskeid: the course list, the automation note, reimbursement and how to book. */
export async function Courses() {
  const t = await getTranslations("namskeidPage");
  const tCommon = await getTranslations("common");
  const messages = await getMessages();
  const { courses, metrics } = messages.namskeidPage as CoursesMessages;

  return (
    <>
      <section className={cn("wrap", styles.head)}>
        <p className={cn("t-label reveal", styles.eyebrow)}>{t("eyebrow")}</p>
        <h1 className={cn("t-h1 reveal", styles.title)}>
          {t("titleLine1")}
          <span className={cn("accent", styles.accentLine)}>{t("titleAccent")}</span>
        </h1>
        <p className={cn("t-lead reveal", styles.intro)}>{t("intro")}</p>
      </section>

      <section className="wrap">
        <div className={styles.courses}>
          {courses.map((course, i) => (
            <article key={course.title} className={cn(styles.course, "reveal")}>
              <div className={styles.side}>
                <p className={cn(styles.index, "num")} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className={styles.courseTitle}>{course.title}</h2>
                <ul className={styles.specs}>
                  <li>{course.duration}</li>
                  <li className={cn(styles.price, "num")}>{course.price}</li>
                </ul>
              </div>
              <div className={styles.main}>
                <p className={styles.description}>{course.description}</p>
                <div className={styles.facts}>
                  <div>
                    <p className="t-label">{t("audienceLabel")}</p>
                    <p>{course.markhopur}</p>
                  </div>
                  <div>
                    <p className="t-label">{t("contentLabel")}</p>
                    <p>{course.innihald}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={cn(styles.know, "reveal")}>
          <p className="t-label">{t("didYouKnow")}</p>
          <h2>{t("automationTitle")}</h2>
          <p>{t("automationBody")}</p>
          <div className={styles.pair}>
            <div>
              <p className="t-label">{t("implTitle")}</p>
              <p>{t("implBody")}</p>
            </div>
            <div className={styles.train}>
              <p className="t-label">{t("trainTitle")}</p>
              <p>{t("trainBody")}</p>
            </div>
          </div>
          <p className={styles.footnote}>{t("automationFootnote")}</p>
        </div>

        <CutCorner size={72} className={cn(styles.reimb, "reveal")} bodyClassName={cn("on-dark", styles.reimbBody)}>
          <div className={styles.reimbCopy}>
            <h2>{t("reimbTitle")}</h2>
            <p>{t("reimbBody")}</p>
          </div>
          <div className={styles.figures}>
            {metrics.map((metric) => (
              <div key={`${metric.number}-${metric.label}`}>
                <b className="num">
                  <CountUp text={metric.number} />
                </b>
                <span className={styles.figureLabel}>{metric.label}</span>
              </div>
            ))}
          </div>
        </CutCorner>

        <div className={cn(styles.how, "reveal")}>
          <h2>{t("howTitle")}</h2>
          <p>{t("howBody")}</p>
        </div>

        <div className={cn(styles.more, "reveal")}>
          <div className={styles.morePanel}>
            <div className={styles.moreCopy}>
              <h2>{t("moreTitle")}</h2>
              <p>{t("moreBody")}</p>
            </div>
            <div className={styles.moreAction}>
              <BookingLink className="btn btn-primary">
                {tCommon("bookSession")}
                <Arrow />
              </BookingLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
