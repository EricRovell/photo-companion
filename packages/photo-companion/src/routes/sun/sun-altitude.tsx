
import { getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/lib/components";
import { useTranslation } from "~/services/translation";

interface SunAltitudeProps {
	date: Date;
}

export function SunAltitude(props: SunAltitudeProps) {
	const { t } = useTranslation();

	return (
		<section class="card" data-label="altitude">
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
