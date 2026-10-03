import { Show } from "solid-js";

import type { SolarEclipseType, SolarEclipseVisibility } from "moon-sun-calc";

import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

import { SolarEclipseContact } from "../solar-eclipse-contact/solar-eclipse-contact";

import type { SolarEclipseDetailsProps } from "../../model";

import styles from "./solar-eclipse-details.module.css";

export function SolarEclipseDetails(props: SolarEclipseDetailsProps) {
	const { format, t } = useTranslation();
	const solarEclipseTypeLabel = (type: SolarEclipseType) => t().SOLAR_ECLIPSE[type];
	const visibilityLabel = (visibility: SolarEclipseVisibility) => t().SOLAR_ECLIPSE[`VISIBILITY_${visibility}`];

	return (
		<div aria-live="polite" class={styles.summary}>
			<Show
				fallback={<Text align="center" as="p" balance class={styles.empty} color="secondary" variant="text-s">{t().SOLAR_ECLIPSE.NO_ECLIPSE}</Text>}
				when={props.event}
			>
				{event => (
					<>
						<div class={styles["event-header"]}>
							<div class={styles["event-title"]}>
								<Text color="secondary" variant="text-xs">{t().SOLAR_ECLIPSE.EVENT_TYPE}</Text>
								<Text as="strong" variant="heading-l">{solarEclipseTypeLabel(event().type)}</Text>
							</div>
							<div class={styles["event-date"]}>
								<Text color="secondary" variant="text-xs">{t().LABEL.DATE}</Text>
								<Text as="time" datetime={event().peak.time.toISOString()} numeric variant="text-s">{format().date(event().peak.time)}</Text>
							</div>
						</div>

						<dl class={styles.metrics}>
							<div class={styles.metric}>
								<Text as="dt" color="secondary" variant="text-xs">{t().SOLAR_ECLIPSE.CURRENT_OBSCURATION}</Text>
								<Text as="dd" numeric variant="text-m">{format().percent(props.obscuration * 100)}</Text>
							</div>
							<div class={styles.metric}>
								<Text as="dt" color="secondary" variant="text-xs">{t().SOLAR_ECLIPSE.MAXIMUM_SUN_ALTITUDE}</Text>
								<Text as="dd" numeric variant="text-m">{format().degrees(event().peak.sunAltitude)}</Text>
							</div>
							<div class={styles.metric}>
								<Text as="dt" color="secondary" variant="text-xs">{t().SOLAR_ECLIPSE.VISIBILITY}</Text>
								<Text as="dd" numeric variant="text-m">{visibilityLabel(event().visibility)}</Text>
							</div>
						</dl>

						<section class={styles["contacts-section"]} data-page-swipe="ignore">
							<Text align="center" as="h3" color="secondary" variant="heading-s">{t().SOLAR_ECLIPSE.CONTACTS}</Text>
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
