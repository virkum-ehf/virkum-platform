import { getTranslations } from "next-intl/server";

import styles from "./Courses.module.css";

/** The courses page ends with the company line instead of the full call-to-action footer. */
export async function SlimFooter() {
  const t = await getTranslations("common");
  return (
    <footer className={styles.slimFooter}>
      <div className="wrap">{t("footerLegal")}</div>
    </footer>
  );
}
