
import { getSunPosition, getMoonPosition } from "moon-sun-calc";

import { ElevationGraph } from "@lib/components";
import { t } from "@lib/stores/lang";
import styles from "./moon.module.css";

interface MoonAltitudeProps {
	date: Date;
}

export const MoonAltitude = (props: MoonAltitudeProps) => (
	<section data-label="altitude" class="card">
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
