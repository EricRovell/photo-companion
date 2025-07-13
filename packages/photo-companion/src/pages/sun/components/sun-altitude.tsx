
import { getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/components";
import { useDatetime } from "~/hooks";
import { useTranslation } from "~/services/translation";

export function SunAltitude() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();

	return (
		<section class="card" data-label="altitude">
			<header>
				<h2>{t().TITLE.ELEVATION_SUN}</h2>
			</header>
			<ElevationGraph
				date={getDatetime()}
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
