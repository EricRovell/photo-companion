import { getMoonIllumination, getMoonTimes, getMoonPosition } from "moon-sun-calc";
import { calcDuration } from "utils/date";
import { round } from "utils/math";
import { isNullable, isValidDate } from "utils/validators";
import { formatDegrees, formatKilometers, formatPercent, formatTime } from "utils/formatters";
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
	phases: {
		phase: 0 | 0.25 | 0.5 | 0.75;
		timestamp: number;
	}[]
	zenith: string;
	azimuth: string;
	altitude: string;
	distance: string;
	parallacticAngle: string;
	name: MoonPhaseName;
}

export const getMoonPhases = (date: Date = new Date()): MoonData["phases"] => {
	if (!isValidDate(date)) {
		return [];
	}

	const dataCurr = getMoonIllumination(date);
	const dataNext = getMoonIllumination(
		new Date(dataCurr.next.newMoon.value)
	);

	return [
		{
			phase: 0,
			timestamp: dataCurr.next.newMoon.value
		},
		{
			phase: 0.25,
			timestamp: dataCurr.next.firstQuarter.value
		},
		{
			phase: 0.5,
			timestamp: dataCurr.next.fullMoon.value
		},
		{
			phase: 0.75,
			timestamp: dataCurr.next.thirdQuarter.value
		},
		{
			phase: 0,
			timestamp: dataNext.next.newMoon.value
		}
	];
};

export const getMoonData = (date: Date = new Date(), lat: number, lon: number): MoonData => {
	const times = getMoonTimes(date, lat, lon);
	const illumination = getMoonIllumination(date);
	const position = getMoonPosition(date, lat, lon);

	return {
		duration: formatTime(calcDuration(times.rise, times.set)),
		moonrise: times.rise,
		moonset: times.set,
		fraction: formatPercent(round(illumination.fraction * 100, 2)),
		waxing: illumination.angle < 0,
		phaseValue: round(illumination.phaseValue, 4),
		angle: illumination.angle,
		phases: getMoonPhases(date),
		rotation: -(illumination.angle - position.parallacticAngle) / 4,
		name: illumination.phase.id,
		zenith: formatDegrees(round(illumination.angleDegrees - position.parallacticAngleDegrees, 2)),
		azimuth: formatDegrees(round(position.azimuthDegrees, 2)),
		altitude: formatDegrees(round(position.altitudeDegrees, 2)),
		distance: formatKilometers(round(position.distance, 2)),
		parallacticAngle: formatDegrees(round(position.parallacticAngleDegrees, 2))
	};
};

export const getMoonEvents = (date: Date = new Date(), lat: number, lon: number): MoonEvent[] => {
	const events: MoonEvent[] = [];
	const data = getMoonData(date, lat, lon);

	if (!isNullable(data.moonrise)) {
		const rise = getMoonData(data.moonrise, lat, lon);

		events.push({
			data: {
				azimuth: data.azimuth,
				fraction: data.fraction,
				phase: rise.phaseValue,
				waxing: rise.waxing,
				rotation: data.rotation
			},
			name: "MOONRISE",
			timestamp: data.moonrise.getTime(),
			type: "MOON"
		});
	}

	if (!isNullable(data.moonset)) {
		const set = getMoonData(data.moonset, lat, lon);

		events.push({
			data: {
				azimuth: data.azimuth,
				fraction: data.fraction,
				phase: set.phaseValue,
				waxing: set.waxing,
				rotation: data.rotation
			},
			name: "MOONSET",
			timestamp: data.moonset.getTime(),
			type: "MOON"
		});
	}

	return events;
};
