import { getSunPosition } from "moon-sun-calc";

import { AltitudeWidget } from "~/entities/widget-altitude";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { useTranslation } from "~/features/translation";

export function SunAltitude() {
	const { t } = useTranslation();
	const { getDatetime } = useDatetime();
	const { settings } = useSettings();

	return (
		<AltitudeWidget
			date={getDatetime()}
			entities={[ {
				getPosition: getSunPosition,
				id: "sun",
				label: t().TITLE.SUN
			} ]}
			latitude={settings.latitude}
			longitude={settings.longitude}
			title={t().TITLE.ELEVATION_SUN}
		>
			<AltitudeWidget.Header />
			<AltitudeWidget.Content>
				<AltitudeWidget.Chart>
					<AltitudeWidget.Grid />
					<AltitudeWidget.Path />
					<AltitudeWidget.Cursor />
				</AltitudeWidget.Chart>
				<AltitudeWidget.Legend />
			</AltitudeWidget.Content>
		</AltitudeWidget>
	);
}
