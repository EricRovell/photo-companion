import { getSunPosition } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { getDayStart } from "utils/date";

import { createAzimuthPath } from "~/entities/widget-azimuth";
import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";

export function useSunAzimuthPath() {
	const { getDatetime } = useDatetime();
	const { settings } = useSettings();
	const dayStart = createMemo(() => getDayStart(getDatetime()));

	const path = createMemo(() => {
		const date = new Date(dayStart());
		const observer = { latitude: settings.latitude, longitude: settings.longitude };

		return createAzimuthPath(date, instant => {
			const position = getSunPosition({ instant, observer });

			return {
				altitude: position.apparentAltitude,
				azimuth: position.azimuth
			};
		});
	});

	return path;
}
