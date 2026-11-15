import { cn } from "@virkum/ui";
import { getTranslations } from "next-intl/server";

import { AiStat } from "./AiStat";
import styles from "./Market.module.css";
import { RuleBreakdown, type RuleGroup } from "./RuleBreakdown";

/** The AI statistic with its 3D grid, then the 10/20/70 rule. */
export async function Market() {
  const t = await getTranslations("marketContext");
  const stat = await getTranslations("aiStat");

  // 20 columns, 5% each: 2 for technology, 4 for data, 14 for people and processes.
  const groups: RuleGroup[] = [
    { group: 1, columns: 2, percent: "10%", title: t("card10Title"), body: t("card10Body") },
    { group: 2, columns: 4, percent: "20%", title: t("card20Title"), body: t("card20Body") },
    { group: 3, columns: 14, percent: "70%", title: t("card70Title"), body: t("card70Body") },
  ];

  return (
    <section className="section">
      <div className="wrap">
        <AiStat
          eyebrow={stat("eyebrow")}
          lineStrong={stat("lineStrong")}
          lineMuted={stat("lineMuted")}
          lineAccent={stat("lineAccent")}
          sourceNote={t("sourceNote")}
        />

        <div className={styles.rule}>
          <div className={styles.ruleHead}>
            <div>
              <p className="t-label reveal">{t("ruleEyebrow")}</p>
              <h2 className="t-h1 reveal">{t("ruleTitle")}</h2>
            </div>
            <p className="t-lead reveal">{t("ruleIntro")}</p>
          </div>
          <RuleBreakdown groups={groups} />
          <div className={cn(styles.callout, "reveal")}>
            <p>{t("failureCallout")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
