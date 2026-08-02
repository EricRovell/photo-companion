import { getMoonIllumination, getMoonPosition, getMoonTimes, getMoonZenithAngle } from "moon-sun-calc";
import { round } from "utils/math";
import { isNullable } from "utils/validators";

import type { MoonEvent } from "types";

import { getMoonRotation } from "~/entities/moon/lib/moon-rotation";
import { useTranslation } from "~/features/translation";

export const getMoonEvents = (date: Date = new Date(), latitude: number, longitude: number): MoonEvent[] => {
	const events: MoonEvent[] = [];
	const times = getMoonTimes(date, latitude, longitude);
	const { format } = useTranslation();

	if (!isNullable(times.rise)) {
		const illumination = getMoonIllumination(times.rise, true);
		const position = getMoonPosition(times.rise, latitude, longitude, true);
		const zenithAngle = getMoonZenithAngle(illumination.angle, position.parallacticAngle);

		events.push({
			data: {
				azimuth: format().degrees(round(position.azimuth, 1)),
				fraction: format().percent(round(illumination.fraction * 100, 1)),
				phase: round(illumination.phaseValue, 4),
				rotation: getMoonRotation(zenithAngle, illumination.angle < 0),
				waxing: illumination.angle < 0
			},
			name: "MOONRISE",
			timestamp: times.rise.getTime(),
			type: "MOON"
		});
	}

	if (!isNullable(times.set)) {
		const illumination = getMoonIllumination(times.set, true);
		const position = getMoonPosition(times.set, latitude, longitude, true);
		const zenithAngle = getMoonZenithAngle(illumination.angle, position.parallacticAngle);

		events.push({
			data: {
				azimuth: format().degrees(round(position.azimuth, 1)),
				fraction: format().percent(round(illumination.fraction * 100, 1)),
				phase: round(illumination.phaseValue, 4),
				rotation: getMoonRotation(zenithAngle, illumination.angle < 0),
				waxing: illumination.angle < 0
			},
			name: "MOONSET",
			timestamp: times.set.getTime(),
			type: "MOON"
		});
	}

	return events;
};
