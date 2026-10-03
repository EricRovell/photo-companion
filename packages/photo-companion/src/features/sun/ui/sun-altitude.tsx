
import { getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/entities/elevation-graph";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

export function SunAltitude() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();

	return (
		<section class="card" data-label="altitude">
			<header>
				<Text as="h2" variant="heading-l">{t().TITLE.ELEVATION_SUN}</Text>
			</header>
			<ElevationGraph>
				<ElevationGraph.ZeroAxis />
				<ElevationGraph.Path
					date={getDatetime()}
					getAltitude={getSunPosition}
				/>
				<ElevationGraph.Pointer
					date={getDatetime()}
					getAltitude={getSunPosition}
				/>
				<ElevationGraph.XAxis />
			</ElevationGraph>
		</section>
	);
}
