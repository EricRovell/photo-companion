import { getMoonPhases, getMoonIllumination, getMoonTimes, getMoonPosition } from "moon-sun-calc";
import { calcDuration } from "utils/date";
import { round } from "utils/math";
import { isNullable } from "utils/validators";
import { formatDegrees, formatDuration, formatKilometers, formatPercent } from "utils/formatters";
import type { MoonEvent, MoonPhaseName } from "@shared/types";

export interface MoonData {
	duration: string;
	rotation: number;
	moonrise: Date | null;
	moonset: Date | null;
	fraction: string;
	waxing: boolean;
	phaseValue: number;
	angle: number;
	phases: ReturnType<typeof getMoonPhases>;
	zenith: string;
	azimuth: string;
	altitude: string;
	distance: string;
	parallacticAngle: string;
	name: MoonPhaseName;
}

export const getMoonData = (date: Date = new Date(), lat: number, lon: number): MoonData => {
	const times = getMoonTimes(date, lat, lon);
	const illumination = getMoonIllumination(date, true);
	const position = getMoonPosition(date, lat, lon, true);

	return {
		duration: formatDuration(calcDuration(times.rise, times.set)),
		moonrise: times.rise,
		moonset: times.set,
		fraction: formatPercent(round(illumination.fraction * 100, 1)),
		waxing: illumination.angle < 0,
		phaseValue: round(illumination.phaseValue, 4),
		angle: illumination.angle,
		phases: getMoonPhases(date),
		rotation: -(illumination.angle - position.parallacticAngle) / 4,
		name: illumination.phase.id,
		zenith: formatDegrees(round(illumination.angle - position.parallacticAngle, 1)),
		azimuth: formatDegrees(round(position.azimuth, 1)),
		altitude: formatDegrees(round(position.altitude, 1)),
		distance: formatKilometers(round(position.distance, 2)),
		parallacticAngle: formatDegrees(round(position.parallacticAngle, 1))
	};
};

export const getMoonEvents = (date: Date = new Date(), latitude: number, longitude: number): MoonEvent[] => {
	const events: MoonEvent[] = [];
	const times = getMoonTimes(date, latitude, longitude);

	if (!isNullable(times.rise)) {
		const illumination = getMoonIllumination(times.rise);
		const position = getMoonPosition(times.rise, latitude, longitude, true);

		events.push({
			data: {
				azimuth: formatDegrees(round(position.azimuth, 1)),
				fraction: formatPercent(round(illumination.fraction * 100, 1)),
				phase: round(illumination.phaseValue, 4),
				waxing: illumination.angle < 0,
				rotation: -(illumination.angle - position.parallacticAngle) / 4
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
				azimuth: formatDegrees(round(position.azimuth, 1)),
				fraction: formatPercent(round(illumination.fraction * 100, 1)),
				phase: round(illumination.phaseValue, 4),
				waxing: illumination.angle < 0,
				rotation: -(illumination.angle - position.parallacticAngle) / 4
			},
			name: "MOONSET",
			timestamp: times.set.getTime(),
			type: "MOON"
		});
	}

	return events;
};
