import { createMemo, Show } from "solid-js";
import { classnames } from "utils";

import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { useTranslation } from "~/features/translation";

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
		<article class={classnames("card", styles.root)}>
			<header>
				<h2>{t().TITLE.EARTHSHINE}</h2>
			</header>
			<Show
				fallback={<p class={styles.empty}>{t().MESSAGE.EARTHSHINE_NO_WINDOW}</p>}
				when={earthshine()}
			>
				{value => (
					<>
						<dl class={styles.metrics} data-rating={value().rating.toLowerCase()}>
							<div class={styles.cell}>
								<dt>{t().LABEL.PROBABILITY}</dt>
								<dd class={styles.outcome}>
									<strong>{t().EARTHSHINE_RATING[value().rating]}</strong>
								</dd>
							</div>
							<div class={styles.cell}>
								<dt>{t().LABEL.BEST_WINDOW}</dt>
								<dd>{format().timeShort(value().dateStart)} – {format().timeShort(value().dateEnd)}</dd>
							</div>
							<div class={styles.cell}>
								<dt>{t().LABEL.MOON_ILLUMINATION}</dt>
								<dd>{format().percent(value().peak.illumination * 100)}</dd>
							</div>
							<div class={styles.cell}>
								<dt>{t().LABEL.PEAK_TIME}</dt>
								<dd>{format().timeShort(value().peak.time)}</dd>
							</div>
							<div class={styles.cell}>
								<dt>{t().LABEL.ALTITUDE}</dt>
								<dd>{format().degrees(value().peak.altitude)}</dd>
							</div>
							<div class={styles.cell}>
								<dt>{t().LABEL.AZIMUTH}</dt>
								<dd>{format().degrees(value().peak.azimuth)}</dd>
							</div>
						</dl>
						<p class={styles.note}>{t().MESSAGE.EARTHSHINE_WEATHER_NOTE}</p>
					</>
				)}
			</Show>
		</article>
	);
}
