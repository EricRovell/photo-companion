import { getMoonPosition, getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/entities/elevation-graph";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";

import styles from "./moon-altitude.module.css";

export function MoonAltitude() {
	const { getDatetime } = useDatetime();
	const { t } = useTranslation();

	return (
		<section class="card" data-label="altitude">
			<header>
				<h2>{t().TITLE.ELEVATION_MOON}</h2>
			</header>

			<ElevationGraph>
				<ElevationGraph.ZeroAxis />
				<ElevationGraph.Path
					class={styles["elevation-path-sun"]}
					date={getDatetime()}
					getAltitude={getSunPosition}
				/>
				<ElevationGraph.Pointer
					class={styles["elevation-pointer-sun"]}
					date={getDatetime()}
					getAltitude={getSunPosition}
					pointerSize={5}
				/>
				<ElevationGraph.Path
					class={styles["elevation-path-moon"]}
					date={getDatetime()}
					getAltitude={getMoonPosition}
				/>
				<ElevationGraph.Pointer
					class={styles["elevation-pointer-moon"]}
					date={getDatetime()}
					getAltitude={getMoonPosition}
					pointerSize={7}
				/>
				<ElevationGraph.XAxis />
			</ElevationGraph>
		</section>
	);
}
