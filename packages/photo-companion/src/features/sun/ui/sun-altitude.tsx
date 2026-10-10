
import { getSunPosition } from "moon-sun-calc";

import { ElevationGraph } from "~/entities/elevation-graph";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { Card, Text } from "~/shared/ui";

export function SunAltitude() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();

	return (
		<Card data-label="altitude">
			<Card.Header>
				<Text as="h2" variant="heading-l">{t().TITLE.ELEVATION_SUN}</Text>
			</Card.Header>
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
		</Card>
	);
}
