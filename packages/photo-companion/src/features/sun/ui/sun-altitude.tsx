
import { getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/entities/elevation-graph";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";

export function SunAltitude() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();

	return (
		<section class="card" data-label="altitude">
			<header>
				<h2>{t().TITLE.ELEVATION_SUN}</h2>
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
