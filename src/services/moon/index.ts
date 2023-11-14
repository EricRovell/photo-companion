// @ts-expect-error: no types for this package
import SunCalc from "suncalc3";
import { isValidDate, round } from "@lib/helpers";
import type { MoonEvent } from "@lib/types";

export interface MoonData {
	moonrise: Date;
	moonset: Date;
	fraction: number;
	waxing: boolean;
	phaseValue: number;
	angle: number;
}

interface MoonPhase {
	phase: 0 | 0.25 | 0.5 | 0.75;
	timestamp: number;
}

export const getMoonData = (date: Date = new Date(), lat: number, lon: number): MoonData => {
	const moonTimes = SunCalc.getMoonTimes(date, lat, lon);
	const illumination = SunCalc.getMoonIllumination(date);

	return {
		moonrise: moonTimes.rise,
		moonset: moonTimes.set,
		fraction: round(illumination.fraction, 2),
		waxing: illumination.angle < 0,
		phaseValue: round(illumination.phaseValue, 4),
		angle: moonTimes.angle
	};
};

export const getMoonEvents = (date: Date = new Date(), lat: number, lon: number): MoonEvent[] => {
	const data = getMoonData(date, lat, lon);
	const rise = getMoonData(data.moonrise, lat, lon);
	const set = getMoonData(data.moonset, lat, lon);

	return [
		{
			name: "moonrise",
			timestamp: data.moonrise.getTime(),
			data: {
				fraction: rise.fraction,
				phase: rise.phaseValue,
				waxing: rise.waxing
			}
		},
		{
			name: "moonset",
			timestamp: data.moonset.getTime(),
			data: {
				fraction: set.fraction,
				phase: set.phaseValue,
				waxing: set.waxing
			}
		}
	];
};

export const getMoonPhases = (date: Date = new Date()): MoonPhase[] => {
	if (!isValidDate(date)) {
		return [];
	}

	const dataCurr = SunCalc.getMoonIllumination(date);
	const dataNext = SunCalc.getMoonIllumination(
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
