import { cn } from "@virkum/ui";
import { getMessages } from "next-intl/server";

import styles from "./Clients.module.css";

type StatsBarMessages = { clientsLabel: string; clients: string[] };

/** Client names on a slow marquee that pauses on hover (static with reduced motion). */
export async function Clients() {
  const messages = await getMessages();
  const { clientsLabel, clients } = messages.statsBar as StatsBarMessages;
  // The list repeats so the loop is seamless; only the first copy is read out.
  const copies = 4;

  return (
    <section className={styles.clients} aria-label={clientsLabel}>
      <div className={cn("wrap", styles.inner)}>
        <p className={cn("t-label", styles.label)}>{clientsLabel}</p>
        <div className={styles.window}>
          <ul className={styles.track} translate="no">
            {Array.from({ length: copies }, (_, copy) =>
              clients.map((client) => (
                <li key={`${copy}-${client}`} aria-hidden={copy > 0 || undefined}>
                  {client}
                </li>
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
