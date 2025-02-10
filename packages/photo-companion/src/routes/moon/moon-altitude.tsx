
import { getMoonPosition, getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/lib/components";
import { useTranslation } from "~/services/translation";

import styles from "./moon.module.css";

interface MoonAltitudeProps {
	date: Date;
}

export function MoonAltitude(props: MoonAltitudeProps) {
	const { t } = useTranslation();

	return (
		<section class="card" data-label="altitude">
			<header>
				<h2>{t().TITLE.ELEVATION_MOON}</h2>
			</header>
			<ElevationGraph
				date={props.date}
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
