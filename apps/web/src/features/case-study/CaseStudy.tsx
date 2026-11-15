import { cn, CutCorner, parsePercent } from "@virkum/ui";
import { CountUp } from "@virkum/ui/client";
import { getMessages, getTranslations } from "next-intl/server";

import { CaseResultVisual } from "./CaseResultVisual";
import styles from "./CaseStudy.module.css";
import { RecommendationsRail } from "./RecommendationsRail";
import { ScenarioChart } from "./ScenarioChart";

type Metric = { label: string; value: string; unit: string; change: string };
type Scenario = { name: string; from: string; amount: string; highlight?: boolean };
type Recommendation = { tag: string; title: string; body: string };
type CaseStudyMessages = { metrics: Metric[]; scenarios: Scenario[]; recommendations: Recommendation[] };

/** Ratio before and after the arrow in "12.8% → 15.8%". */
const ratios = (from: string) => {
  const [before, after] = from.split("→");
  return { before: parsePercent(before), after: parsePercent(after) };
};

/** /daemi: an operational review of an Icelandic contractor, with its estimated result. */
export async function CaseStudy() {
  const tPage = await getTranslations("daemiPage");
  const t = await getTranslations("caseStudy");
  const messages = await getMessages();
  const { metrics, scenarios, recommendations } = messages.caseStudy as CaseStudyMessages;
  const baseline = ratios(scenarios[0]?.from ?? "").before;

  return (
    <section id="case-study" className={cn("wrap", styles.page)}>
      <header className={styles.head}>
        <p className={cn("t-label reveal", styles.eyebrow)}>{tPage("eyebrow")}</p>
        <h1 className={cn("t-h1 reveal", styles.title)}>
          {tPage("titleBefore")}
          <span className="accent">{tPage("titleAccent")}</span>
        </h1>
        <p className={cn(styles.intro, "reveal")}>{t("intro")}</p>
      </header>

      <CutCorner size={80} className={cn(styles.result, "reveal")} bodyClassName={cn("on-dark", styles.resultBody)}>
        <div className={styles.resultCopy}>
          <p className="t-label">{t("estimated")}</p>
          <p className={cn(styles.big, "num")}>
            <CountUp text={t("result")} />
          </p>
          <p className={styles.summary}>{t("summary")}</p>
        </div>
        <CaseResultVisual />
      </CutCorner>

      <div className={styles.metrics}>
        {metrics.map((metric) => (
          <div key={metric.label} className={cn(styles.metric, "reveal")}>
            <p className={styles.metricLabel}>{metric.label}</p>
            <p className={cn(styles.metricValue, "num")}>
              <CountUp text={metric.value} />
              {metric.unit ? <small>{metric.unit}</small> : null}
            </p>
            <p className={cn(styles.metricChange, "num")}>{metric.change}</p>
          </div>
        ))}
      </div>

      <div className={styles.twoUp}>
        <div className="reveal">
          <p className="t-label">{t("strengthsLabel")}</p>
          <p>{t("strengthsBody")}</p>
        </div>
        <div className="reveal">
          <p className="t-label">{t("risksLabel")}</p>
          <p>{t("risksBody")}</p>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <h2 className="t-h2 reveal">{t("scenariosTitle")}</h2>
          <p className="reveal">{t("scenariosIntro")}</p>
        </div>
        <div className={styles.scenarios}>
          {scenarios.map((scenario) => (
            <div key={scenario.name} className={cn(styles.scenario, scenario.highlight && styles.highlight, "reveal")}>
              <p className="t-label">
                {scenario.name} {t("scenarioSuffix")}
              </p>
              <div className={cn(styles.chart, "rise")} aria-hidden="true">
                <ScenarioChart
                  baseline={baseline}
                  target={ratios(scenario.from).after}
                  highlight={!!scenario.highlight}
                />
              </div>
              <p className={styles.metricName}>{t("scenarioMetricLabel")}</p>
              <p className={cn(styles.from, "num")}>{scenario.from}</p>
              <p className={cn(styles.amount, "num")}>
                <CountUp text={scenario.amount} />
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <h2 className="t-h2 reveal">{t("recommendationsTitle")}</h2>
        </div>
        <RecommendationsRail className={styles.actions}>
          {recommendations.map((recommendation, i) => (
            <li key={recommendation.title} className="reveal">
              <div className={styles.when}>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="t-label">{recommendation.tag}</span>
              </div>
              <div className={styles.what}>
                <h3>{recommendation.title}</h3>
                <p>{recommendation.body}</p>
              </div>
            </li>
          ))}
        </RecommendationsRail>
      </div>

      <div className={cn(styles.closing, "reveal")}>
        <p className="t-label">{t("closingLabel")}</p>
        <p>{t("closingBody")}</p>
      </div>
    </section>
  );
}
