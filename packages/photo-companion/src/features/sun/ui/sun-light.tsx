import { SunlightWidget } from "~/entities/widget-sunlight";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";

export function SunLight() {
	const { getDatetime, getTimerTimestamp } = useDatetime();
	const { settings } = useSettings();

	return (
		<SunlightWidget
			date={getDatetime()}
			getTimerTimestamp={getTimerTimestamp}
			latitude={settings.latitude}
			longitude={settings.longitude}
		/>
	);
}
