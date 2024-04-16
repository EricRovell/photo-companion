
import { getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "@lib/components";
import { t } from "@lib/stores/lang";

interface SunAltitudeProps {
	date: Date;
}

export const SunAltitude = (props: SunAltitudeProps) => (
	<section data-label="altitude" class="card">
		<header>
			<h2>{t().TITLE.ELEVATION_SUN}</h2>
		</header>
		<ElevationGraph
			date={props.date}
			entries={[
				{
					getAltitude: getSunPosition,
					id: "sun"
				}
			]}
		/>
	</section>
);
