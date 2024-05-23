import { getSunTimes, getSunPosition } from "moon-sun-calc";
import { objectEntries } from "utils";
import { round } from "utils/math";
import type { SunEventName, SunEvent } from "types";

import { useTranslation } from "@lib/context";

export const getSunEvents = (date: Date = new Date(), lat: number, lon: number): SunEvent[] => {
	const { formatters } = useTranslation();
	const data = getSunTimes(date, lat, lon);

	const sunEvents: SunEvent[] = [];

	for (const [ key, value ] of objectEntries(data)) {
		sunEvents.push({
			data: {
				azimuth: formatters().formatDegrees(round(getSunPosition(value.timestamp, lat, lon).azimuth, 1))
			},
			name: key as SunEventName,
			timestamp: value.timestamp,
			type: "SUN"
		});
	}

	return sunEvents;
};
