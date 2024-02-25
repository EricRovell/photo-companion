import { getMoonIllumination, getMoonTimes, getMoonData as calcMoonData } from "moon-sun-calc";
import { isNullable, isValidDate, round } from "@shared/utils";
import type { MoonEvent, MoonPhaseName } from "@shared/types";

export interface MoonData {
	moonrise: Date | null;
	moonset: Date | null;
	fraction: number;
	waxing: boolean;
	phaseValue: number;
	angle: number;
	phases: {
		phase: 0 | 0.25 | 0.5 | 0.75;
		timestamp: number;
	}[]
	zenithAngle: number;
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
	const moonTimes = getMoonTimes(date, lat, lon);
	const illumination = getMoonIllumination(date);
	const data = calcMoonData(date, lat, lon);

	return {
		moonrise: moonTimes.rise,
		moonset: moonTimes.set,
		fraction: round(illumination.fraction, 3),
		waxing: illumination.angle < 0,
		phaseValue: round(illumination.phaseValue, 4),
		angle: illumination.angle,
		phases: getMoonPhases(date),
		zenithAngle: -data.zenithAngle / 4,
		name: illumination.phase.id
	};
};

export const getMoonEvents = (date: Date = new Date(), lat: number, lon: number): MoonEvent[] => {
	const events: MoonEvent[] = [];
	const data = getMoonData(date, lat, lon);

	if (!isNullable(data.moonrise)) {
		const rise = getMoonData(data.moonrise, lat, lon);

		events.push({
			data: {
				fraction: round(rise.fraction * 100, 1),
				phase: rise.phaseValue,
				waxing: rise.waxing,
				zenithAngle: rise.zenithAngle
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
				fraction: round(set.fraction * 100, 1),
				phase: set.phaseValue,
				waxing: set.waxing,
				zenithAngle: set.zenithAngle
			},
			name: "MOONSET",
			timestamp: data.moonset.getTime(),
			type: "MOON"
		});
	}

	return events;
};
