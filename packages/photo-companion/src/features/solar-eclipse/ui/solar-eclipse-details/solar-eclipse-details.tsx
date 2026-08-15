import { Show } from "solid-js";

import type { SolarEclipseKind, SolarEclipseVisibility } from "moon-sun-calc";

import { useTranslation } from "~/features/translation";

import { SolarEclipseContact } from "../solar-eclipse-contact/solar-eclipse-contact";

import type { SolarEclipseDetailsProps } from "../../model";

import styles from "./solar-eclipse-details.module.css";

export function SolarEclipseDetails(props: SolarEclipseDetailsProps) {
	const { format, t } = useTranslation();
	const solarEclipseTypeLabel = (kind: SolarEclipseKind) => t().SOLAR_ECLIPSE[kind];
	const visibilityLabel = (visibility: SolarEclipseVisibility) => t().SOLAR_ECLIPSE[`VISIBILITY_${visibility}`];

	return (
		<div aria-live="polite" class={styles.summary}>
			<Show
				fallback={<p class={styles.empty}>{t().SOLAR_ECLIPSE.NO_ECLIPSE}</p>}
				when={props.event}
			>
				{event => (
					<>
						<div class={styles["event-header"]}>
							<div class={styles["event-title"]}>
								<span>{t().SOLAR_ECLIPSE.EVENT_TYPE}</span>
								<strong>{solarEclipseTypeLabel(event().kind)}</strong>
							</div>
							<div class={styles["event-date"]}>
								<span>{t().LABEL.DATE}</span>
								<time datetime={event().peak.time.toISOString()}>{format().date(event().peak.time)}</time>
							</div>
						</div>

						<dl class={styles.metrics}>
							<div class={styles.metric}>
								<dt>{t().SOLAR_ECLIPSE.CURRENT_OBSCURATION}</dt>
								<dd>{format().percent(props.obscuration * 100)}</dd>
							</div>
							<div class={styles.metric}>
								<dt>{t().SOLAR_ECLIPSE.MAXIMUM_SUN_ALTITUDE}</dt>
								<dd>{format().degrees(event().peak.sunAltitude)}</dd>
							</div>
							<div class={styles.metric}>
								<dt>{t().SOLAR_ECLIPSE.VISIBILITY}</dt>
								<dd>{visibilityLabel(event().visibility)}</dd>
							</div>
						</dl>

						<section class={styles["contacts-section"]}>
							<h3>{t().SOLAR_ECLIPSE.CONTACTS}</h3>
							<ol aria-label={t().SOLAR_ECLIPSE.CONTACTS} class={styles.contacts}>
								<SolarEclipseContact contact={event().partialBegin} label={t().SOLAR_ECLIPSE.FIRST_CONTACT} position="begin" />
								<SolarEclipseContact contact={event().peak} label={t().SOLAR_ECLIPSE.MAXIMUM} position="peak" />
								<SolarEclipseContact contact={event().partialEnd} label={t().SOLAR_ECLIPSE.FOURTH_CONTACT} position="end" />
							</ol>
						</section>
					</>
				)}
			</Show>
		</div>
	);
}
