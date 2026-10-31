import { SunlightWidget } from "~/entities/widget-sunlight";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";

export function SunLight() {
	const { getDatetime } = useDatetime();
	const { settings } = useSettings();

	return (
		<SunlightWidget
			date={getDatetime()}
			latitude={settings.latitude}
			longitude={settings.longitude}
		/>
	);
}
