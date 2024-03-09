import { calcSunCoordinates } from "../sun/coordinates";

import { MOON_CYCLE_LIST, FIRST_NEW_MOON_2000, LUNAR_DAYS_MS } from "./consts";
import { calcMoonCoordinates } from "./coordinates";
import { toDays } from "../utils";
import type { MoonIllumination, MoonPhase } from "../types";

/**
 * Calculations for illumination parameters of the moon,
 * based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
 * Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
 */
export function getMoonIllumination(dateValue: Date | number): MoonIllumination {
	if (dateValue instanceof Date) {
		dateValue = dateValue.valueOf();
	}

	const days = toDays(dateValue);
	const s = calcSunCoordinates(days);
	const m = calcMoonCoordinates(days);
	const sdist = 149598000;  // distance from Earth to Sun in km
	const phi = Math.acos(Math.sin(s.dec) * Math.sin(m.dec) + Math.cos(s.dec) * Math.cos(m.dec) * Math.cos(s.ra - m.ra));
	const inc = Math.atan2(sdist * Math.sin(phi), m.dist - sdist * Math.cos(phi));
	const angle = Math.atan2(Math.cos(s.dec) * Math.sin(s.ra - m.ra), Math.sin(s.dec) * Math.cos(m.dec) - Math.cos(s.dec) * Math.sin(m.dec) * Math.cos(s.ra - m.ra));
	const phaseValue = 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI;

	// calculates the difference in ms between the sirst fullMoon 2000 and given Date
	const diffBase = dateValue - FIRST_NEW_MOON_2000;
	// Calculate modulus to drop completed cycles
	let cycleModMs = diffBase % LUNAR_DAYS_MS;

	// If negative number (date before new moon 2000) add LUNAR_DAYS_MS
	if ( cycleModMs < 0 ) {
		cycleModMs += LUNAR_DAYS_MS;
	}

	const nextNewMoon = (LUNAR_DAYS_MS - cycleModMs) + dateValue;
	let nextFullMoon = ((LUNAR_DAYS_MS/2) - cycleModMs) + dateValue;

	if (nextFullMoon < dateValue) {
		nextFullMoon += LUNAR_DAYS_MS;
	}

	const quater = (LUNAR_DAYS_MS/4);
	let nextFirstQuarter = (quater - cycleModMs) + dateValue;

	if (nextFirstQuarter < dateValue) {
		nextFirstQuarter += LUNAR_DAYS_MS;
	}

	let nextThirdQuarter = (LUNAR_DAYS_MS - quater - cycleModMs) + dateValue;

	if (nextThirdQuarter < dateValue) {
		nextThirdQuarter += LUNAR_DAYS_MS;
	}

	// Calculate the fraction of the moon cycle
	// const currentfrac = cycleModMs / LUNAR_DAYS_MS;
	const next = Math.min(nextNewMoon, nextFirstQuarter, nextFullMoon, nextThirdQuarter);
	let phase!: MoonPhase;

	for (let index = 0; index < MOON_CYCLE_LIST.length; index++) {
		const element = MOON_CYCLE_LIST[index];

		if ((phaseValue >= element.from) && (phaseValue <= element.to) ) {
			phase = element;
			break;
		}
	}

	return {
		fraction: (1 + Math.cos(inc)) / 2,
		// fraction2: cycleModMs / LUNAR_DAYS_MS,
		phase,
		phaseValue,
		angle,
		next : {
			value: next,
			date: (new Date(next)).toISOString(),
			type: (next === nextNewMoon) ? "NEW_MOON" : ((next === nextFirstQuarter) ? "FIRST_QUARTER" : ((next === nextFullMoon) ? "FULL_MOON" : "THIRD_QUARTER")),
			newMoon: {
				value: nextNewMoon,
				date: (new Date(nextNewMoon)).toISOString()
			},
			fullMoon: {
				value: nextFullMoon,
				date: (new Date(nextFullMoon)).toISOString()
			},
			firstQuarter: {
				value: nextFirstQuarter,
				date: (new Date(nextFirstQuarter)).toISOString()
			},
			thirdQuarter: {
				value: nextThirdQuarter,
				date: (new Date(nextThirdQuarter)).toISOString()
			}
		}
	};
}
