import { getMoonEvents as calculateMoonEvents, getMoonIllumination, getMoonPosition, getMoonZenithAngle } from "moon-sun-calc";
import { getDayStart, incrementDateByDay } from "utils/date";
import { round } from "utils/math";

import { getMoonRotation } from "~/entities/moon/lib/moon-rotation";
import { useTranslation } from "~/features/translation";

import type { MoonEvent } from "~/entities/timeline-event/types";

export const getMoonEvents = (date: Date = new Date(), latitude: number, longitude: number): MoonEvent[] => {
	const { format } = useTranslation();

	const events: MoonEvent[] = [];
	const start = getDayStart(date);
	const observer = { latitude, longitude };

	const times = calculateMoonEvents({
		interval: {
			end: incrementDateByDay(start, 1).getTime(),
			start
		},
		observer
	});

	for (const event of times) {
		if (event.name !== "MOONRISE" && event.name !== "MOONSET") {continue;}
		const illumination = getMoonIllumination(event.time);
		const position = getMoonPosition({ instant: event.time, observer });
		const zenithAngle = getMoonZenithAngle(illumination.angle, position.parallacticAngle);

		events.push({
			data: {
				azimuth: format().degrees(round(position.azimuth, 1)),
				fraction: format().percent(round(illumination.fraction * 100, 1)),
				phase: round(illumination.phaseValue, 4),
				rotation: getMoonRotation(zenithAngle, illumination.waxing),
				waxing: illumination.waxing
			},
			name: event.name,
			timestamp: event.time.getTime(),
			type: "MOON"
		});
	}

	return events;
};
