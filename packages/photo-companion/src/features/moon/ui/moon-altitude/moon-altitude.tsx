import { getMoonPosition, getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/entities/elevation-graph";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { Card, Text } from "~/shared/ui";

import styles from "./moon-altitude.module.css";

export function MoonAltitude() {
	const { getDatetime } = useDatetime();
	const { t } = useTranslation();

	return (
		<Card data-label="altitude">
			<Card.Header>
				<Text as="h2" variant="heading-l">{t().TITLE.ELEVATION_MOON}</Text>
			</Card.Header>

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
		</Card>
	);
}
