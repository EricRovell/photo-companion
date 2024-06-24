import { getSunPosition, getSunTimes } from "moon-sun-calc";
import { objectEntries } from "utils";
import { round } from "utils/math";

import type { SunEvent, SunEventName } from "types";

import { useTranslation } from "@lib/context";

export const getSunEvents = (date: Date = new Date(), lat: number, lon: number): SunEvent[] => {
	const { formatters } = useTranslation();
	const data = getSunTimes(date, lat, lon);

	const sunEvents: SunEvent[] = [];

	for (const [ key, value ] of objectEntries(data)) {
		if (!value.valid) {
			continue;
		}

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
