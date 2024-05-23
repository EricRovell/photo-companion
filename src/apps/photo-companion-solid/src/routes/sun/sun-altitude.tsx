
import { getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "@lib/components";
import { useTranslation } from "@lib/context";

interface SunAltitudeProps {
	date: Date;
}

export function SunAltitude(props: SunAltitudeProps) {
	const { t } = useTranslation();

	return (
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
}
