/* eslint-disable @next/next/no-img-element -- small static portraits from /public; next/image cannot optimise in a static export. */
import { cn } from "@virkum/ui";
import { getMessages, getTranslations } from "next-intl/server";

import styles from "./Team.module.css";

type Member = { name: string; image: string; role: string; stats: string[] };

export async function Team() {
  const t = await getTranslations("teamSection");
  const messages = await getMessages();
  const members = (messages.teamSection as { members: Member[] }).members;

  return (
    <section className="section">
      <div className="wrap">
        <header className={styles.head}>
          <p className="t-label reveal">{t("eyebrow")}</p>
          <h2 className="t-h1 reveal">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h2>
        </header>
        <div className={styles.grid}>
          {members.map((member) => (
            <article key={member.name} className={cn(styles.member, "reveal")}>
              <img src={member.image} alt={member.name} width={104} height={104} loading="lazy" decoding="async" />
              <h3 translate="no">{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              <ul className={styles.facts}>
                {member.stats.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
