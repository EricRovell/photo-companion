import { FIRST_NEW_MOON_2000, LUNAR_DAYS_MS, LUNAR_DAYS_MS_HALF, LUNAR_DAYS_MS_QUARTER } from "./consts";
import type { MoonPhaseName } from "types";

interface MoonPhase {
	phaseName: MoonPhaseName;
	phaseValue: number;
	timestamp: number;
}

function addLunarDays(value: number, thresholdValue: number) {
	return value < thresholdValue
		? value + LUNAR_DAYS_MS
		: value;
}

/**
 * Calculates the nearest moon phases from the given date.
 */
export function getMoonPhases(date: DateLike): MoonPhase[] {
	const timestamp = new Date(date).getTime();
	const diffBase = timestamp - FIRST_NEW_MOON_2000;

	// Calculate modulus to drop completed cycles
	const cycleModMs = addLunarDays(diffBase % LUNAR_DAYS_MS, 0);

	const nextNewMoon = addLunarDays(LUNAR_DAYS_MS - cycleModMs + timestamp, timestamp);
	const nextFullMoon = addLunarDays(LUNAR_DAYS_MS_HALF - cycleModMs + timestamp, timestamp);
	const nextFirstQuarter = addLunarDays(LUNAR_DAYS_MS_QUARTER - cycleModMs + timestamp, timestamp);
	const nextThirdQuarter = addLunarDays(LUNAR_DAYS_MS - LUNAR_DAYS_MS_QUARTER - cycleModMs + timestamp, timestamp);

	const phases: MoonPhase[] = [
		{
			phaseName: "NEW_MOON",
			phaseValue: 0,
			timestamp: nextNewMoon
		},
		{
			phaseName: "FIRST_QUARTER",
			phaseValue: 0.25,
			timestamp: nextFirstQuarter
		},
		{
			phaseName: "FULL_MOON",
			phaseValue: 0.5,
			timestamp: nextFullMoon
		},
		{
			phaseName: "THIRD_QUARTER",
			phaseValue: 0.75,
			timestamp: nextThirdQuarter
		}
	];

	phases.sort((a, b) => a.timestamp - b.timestamp);

	return phases;
}
