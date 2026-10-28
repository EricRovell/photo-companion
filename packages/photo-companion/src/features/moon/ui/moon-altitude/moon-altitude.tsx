import { getMoonPosition, getSunPosition } from "moon-sun-calc";

import { AltitudeWidget } from "~/entities/widget-altitude";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { useTranslation } from "~/features/translation";

export function MoonAltitude() {
	const { getDatetime } = useDatetime();
	const { t } = useTranslation();
	const { settings } = useSettings();

	return (
		<AltitudeWidget
			date={getDatetime()}
			entities={[
				{
					getPosition: getSunPosition,
					id: "sun",
					label: t().TITLE.SUN
				},
				{
					getPosition: getMoonPosition,
					id: "moon",
					label: t().TITLE.MOON
				}
			]}
			latitude={settings.latitude}
			longitude={settings.longitude}
			title={t().TITLE.ELEVATION_MOON}
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
