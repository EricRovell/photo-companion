import { getMoonIllumination, getMoonPosition, getMoonTimes } from "moon-sun-calc";
import { round } from "utils/math";
import { isNullable } from "utils/validators";

import type { MoonEvent } from "types";

import { useTranslation } from "~/lib/context/translation";

export const getMoonEvents = (date: Date = new Date(), latitude: number, longitude: number): MoonEvent[] => {
	const events: MoonEvent[] = [];
	const times = getMoonTimes(date, latitude, longitude);
	const { formatters } = useTranslation();

	if (!isNullable(times.rise)) {
		const illumination = getMoonIllumination(times.rise);
		const position = getMoonPosition(times.rise, latitude, longitude, true);

		events.push({
			data: {
				azimuth: formatters().formatDegrees(round(position.azimuth, 1)),
				fraction: formatters().formatPercent(round(illumination.fraction * 100, 1)),
				phase: round(illumination.phaseValue, 4),
				rotation: -(illumination.angle - position.parallacticAngle) / 4,
				waxing: illumination.angle < 0
			},
			name: "MOONRISE",
			timestamp: times.rise.getTime(),
			type: "MOON"
		});
	}

	if (!isNullable(times.set)) {
		const illumination = getMoonIllumination(times.set);
		const position = getMoonPosition(times.set, latitude, longitude, true);

		events.push({
			data: {
				azimuth: formatters().formatDegrees(round(position.azimuth, 1)),
				fraction: formatters().formatPercent(round(illumination.fraction * 100, 1)),
				phase: round(illumination.phaseValue, 4),
				rotation: -(illumination.angle - position.parallacticAngle) / 4,
				waxing: illumination.angle < 0
			},
			name: "MOONSET",
			timestamp: times.set.getTime(),
			type: "MOON"
		});
	}

	return events;
};
