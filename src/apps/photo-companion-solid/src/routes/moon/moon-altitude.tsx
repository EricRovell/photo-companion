
import { getSunPosition, getMoonPosition } from "moon-sun-calc";

import { useTranslation } from "@lib/context";
import { ElevationGraph } from "@lib/components";
import styles from "./moon.module.css";

interface MoonAltitudeProps {
	date: Date;
}

export function MoonAltitude(props: MoonAltitudeProps) {
	const { t } = useTranslation();

	return (
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
}
