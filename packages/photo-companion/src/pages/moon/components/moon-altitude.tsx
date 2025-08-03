import { getMoonPosition, getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/components";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";

import styles from "../moon.module.css";

export function MoonAltitude() {
	const { getDatetime } = useDatetime();
	const { t } = useTranslation();

	return (
		<section class="card" data-label="altitude">
			<header>
				<h2>{t().TITLE.ELEVATION_MOON}</h2>
			</header>
			<ElevationGraph
				date={getDatetime()}
				entries={[
					{
						class: styles["elevation-graph-sun"],
						getAltitude: getSunPosition,
						id: "sun",
						pointerSize: 5
					},
					{
						class: styles["elevation-graph-moon"],
						getAltitude: getMoonPosition,
						id: "moon",
						pointerSize: 7
					}
				]}
			/>
		</section>
	);
}
