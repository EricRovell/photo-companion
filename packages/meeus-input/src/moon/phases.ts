import { getDecimalYear } from "../times";
import { fmod } from "../utils";
import { MOON_PHASE_UPPER_LIMITS, MOON_SYNODIC_PERIOD } from "./consts";

import type { Day, JulianDay } from "../types";
import type { MoonPhaseName, MoonPhaseQuarter } from "./consts";

// The value of K must be an integer
function getK (jd: JulianDay): number {
	const decimalYear = getDecimalYear(jd);
	const decimalK = 12.3685 * (decimalYear - 2000);
	return decimalK >= 0 ? Math.floor(decimalK) : Math.ceil(decimalK);
}

function getPhaseK (jd: JulianDay, phase: MoonPhaseQuarter): number {
	let k = getK(jd);

	if (phase === "FIRST_QUARTER") {
		k = k + 0.25;
	} else if (phase == "FULL") {
		k = k + 0.5;
	} else if (phase == "LAST_QUARTER") {
		k = k + 0.75;
	}

	return k;
}

/**
 * The time of a given Moon phase.
 * Results are already corrected for the Sun's aberration and by the Moon's light-time.
 */
export function getTimeOfMeanPhase (jd: JulianDay, phase: MoonPhaseQuarter): JulianDay {
	const k = getPhaseK(jd, phase);
	const T = k / 1236.85;
	return 2451_550.097_66
    + 29.530_588_861 * k
    + 0.000_154_37 * T * T
    - 0.000_000_150 * T * T * T
    + 0.000_000_000_73 * T * T * T * T;
}

/**
 * The age of the Moon cycle (0 = New Moon, MOON_SYNODIC_PERIOD/2 = Full Moon).
 * This is a low-accuracy age of the moon, using the average moon synodic period.
 */
export function getAge (jd: JulianDay): Day {
	let jdNewMoon = getTimeOfMeanPhase(jd - MOON_SYNODIC_PERIOD, "NEW");
	if (jdNewMoon > jd) {
		jdNewMoon = jdNewMoon - MOON_SYNODIC_PERIOD;
	}
	return fmod(jd - jdNewMoon, MOON_SYNODIC_PERIOD);
}

/**
 * The age name of the Moon cycle.
 */
export function getAgeName (jd: JulianDay): MoonPhaseName {
	const frac = getAge(jd) / MOON_SYNODIC_PERIOD;
	// Order matter since we wrote down only upper limits.
	if (frac <= (MOON_PHASE_UPPER_LIMITS.NEW)) {
		return "NEW";
	} else if (frac <= (MOON_PHASE_UPPER_LIMITS.WAXING_CRESCENT)) {
		return "WAXING_CRESCENT";
	} else if (frac <= (MOON_PHASE_UPPER_LIMITS.FIRST_QUARTER)) {
		return "FIRST_QUARTER";
	} else if (frac <= (MOON_PHASE_UPPER_LIMITS.WAXING_GIBBOUS)) {
		return "WAXING_GIBBOUS";
	} else if (frac <= (MOON_PHASE_UPPER_LIMITS.FULL)) {
		return "FULL";
	} else if (frac <= (MOON_PHASE_UPPER_LIMITS.WANING_GIBBOUS)) {
		return "WAXING_GIBBOUS";
	} else if (frac <= (MOON_PHASE_UPPER_LIMITS.LAST_QUARTER)) {
		return "LAST_QUARTER";
	} else if (frac <= (MOON_PHASE_UPPER_LIMITS.WANING_CRESCENT)) {
		return "WANING_CRESCENT";
	} else {
		return "NEW";
	}
}
