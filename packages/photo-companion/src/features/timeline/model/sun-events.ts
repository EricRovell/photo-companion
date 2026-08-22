import { getSunEvents as calculateSunEvents, getSunPosition } from "moon-sun-calc";
import { getDayStart, shiftDate } from "utils/date";

import { useTranslation } from "~/features/translation";

import type { SunEvent } from "~/entities/timeline-event/types";

export const getSunEvents = (date: Date = new Date(), lat: number, lon: number): SunEvent[] => {
	const { format } = useTranslation();

	const start = getDayStart(date);
	const observer = { latitude: lat, longitude: lon };

	const data = calculateSunEvents({
		interval: {
			end: shiftDate(start, "day", 1).getTime(),
			start
		},
		observer
	});

	const sunEvents: SunEvent[] = [];

	for (const event of data) {
		sunEvents.push({
			data: {
				azimuth: format().degrees(getSunPosition({ instant: event.time, observer }).azimuth)
			},
			name: event.name,
			timestamp: event.time.getTime(),
			type: "SUN"
		});
	}

	return sunEvents;
};
