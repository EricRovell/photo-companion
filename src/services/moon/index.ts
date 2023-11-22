// @ts-expect-error: no types for this package
import SunCalc from "suncalc3";
import { isValidDate, round } from "@lib/helpers";
import type { MoonEvent } from "@lib/types";

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
}

export const getMoonPhases = (date: Date = new Date()): MoonData["phases"] => {
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

/**
 * SunCalc sometimes return the moonrise/moonset for different days.
 * So, we have to validate the output ourselves.
 */
const isSameDay = (a: Date, b: Date) => {
	return a.getDate() === b.getDate();
};

export const getMoonData = (date: Date = new Date(), lat: number, lon: number): MoonData => {
	const moonTimes = SunCalc.getMoonTimes(date, lat, lon);
	const illumination = SunCalc.getMoonIllumination(date);
	const data = SunCalc.getMoonData(date, lat, lon);

	return {
		moonrise: isSameDay(date, moonTimes.rise) ? moonTimes.rise : null,
		moonset: isSameDay(date, moonTimes.set) ? moonTimes.set : null,
		fraction: round(illumination.fraction, 3),
		waxing: illumination.angle < 0,
		phaseValue: round(illumination.phaseValue, 4),
		angle: moonTimes.angle,
		phases: getMoonPhases(date),
		zenithAngle: -data.zenithAngle / 4
	};
};

export const getMoonEvents = (date: Date = new Date(), lat: number, lon: number): MoonEvent[] => {
	const events: MoonEvent[] = [];
	const data = getMoonData(date, lat, lon);

	if (data.moonrise) {
		const rise = getMoonData(data.moonrise, lat, lon);

		events.push({
			name: "moonrise",
			timestamp: data.moonrise.getTime(),
			data: {
				fraction: round(rise.fraction * 100, 1),
				phase: rise.phaseValue,
				waxing: rise.waxing,
				zenithAngle: rise.zenithAngle
			}
		});
	}

	if (data.moonset) {
		const set = getMoonData(data.moonset, lat, lon);

		events.push({
			name: "moonset",
			timestamp: data.moonset.getTime(),
			data: {
				fraction: round(set.fraction * 100, 1),
				phase: set.phaseValue,
				waxing: set.waxing,
				zenithAngle: set.zenithAngle
			}
		});
	}

	return events;
};
