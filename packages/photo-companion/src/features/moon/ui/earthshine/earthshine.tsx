import { createMemo, Show } from "solid-js";

import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { useTranslation } from "~/features/translation";
import { Card, Text } from "~/shared/ui";

import { getEarthshineProbability } from "../../model";

import styles from "./earthshine.module.css";

export function Earthshine() {
	const { getDatetime } = useDatetime();
	const { settings } = useSettings();
	const { format, t } = useTranslation();

	const earthshine = createMemo(() => getEarthshineProbability(
		getDatetime(),
		settings.latitude,
		settings.longitude
	));

	return (
		<Card as="article">
			<Card.Header>
				<Text as="h2" variant="heading-l">{t().TITLE.EARTHSHINE}</Text>
			</Card.Header>
			<Show
				fallback={<Text as="p" balance class={styles.empty} leading="relaxed" variant="text-s">{t().MESSAGE.EARTHSHINE_NO_WINDOW}</Text>}
				when={earthshine()}
			>
				{value => (
					<>
						<dl class={styles.metrics} data-rating={value().rating.toLowerCase()}>
							<div class={styles.cell}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LABEL.PROBABILITY}</Text>
								<Text as="dd" class={styles.outcome} numeric variant="text-l">
									<Text as="strong" class={styles.rating} variant="heading-l">{t().EARTHSHINE_RATING[value().rating]}</Text>
								</Text>
							</div>
							<div class={styles.cell}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LABEL.BEST_WINDOW}</Text>
								<Text as="dd" numeric variant="text-l">{format().timeShort(value().dateStart)} – {format().timeShort(value().dateEnd)}</Text>
							</div>
							<div class={styles.cell}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LABEL.MOON_ILLUMINATION}</Text>
								<Text as="dd" numeric variant="text-l">{format().percent(value().peak.illumination * 100)}</Text>
							</div>
							<div class={styles.cell}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LABEL.PEAK_TIME}</Text>
								<Text as="dd" numeric variant="text-l">{format().timeShort(value().peak.time)}</Text>
							</div>
							<div class={styles.cell}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LABEL.ALTITUDE}</Text>
								<Text as="dd" numeric variant="text-l">{format().degrees(value().peak.altitude)}</Text>
							</div>
							<div class={styles.cell}>
								<Text as="dt" color="secondary" variant="text-xs">{t().LABEL.AZIMUTH}</Text>
								<Text as="dd" numeric variant="text-l">{format().degrees(value().peak.azimuth)}</Text>
							</div>
						</dl>
						<Text align="center" as="p" balance class={styles.note} color="secondary" leading="relaxed" variant="text-xs">{t().MESSAGE.EARTHSHINE_WEATHER_NOTE}</Text>
					</>
				)}
			</Show>
		</Card>
	);
}
