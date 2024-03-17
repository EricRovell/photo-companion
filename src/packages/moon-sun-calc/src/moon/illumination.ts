import { calcSunCoordinates } from "../sun/coordinates";

import { MOON_CYCLE_LIST } from "./consts";
import { calcMoonCoordinates } from "./coordinates";
import { toDays, toDegrees } from "../utils";
import type { MoonIllumination, MoonPhase } from "../types";

/**
 * Calculations for illumination parameters of the moon,
 * based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
 * Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
 */
export function getMoonIllumination(dateValue: Date | number, degrees = false): MoonIllumination {
	if (dateValue instanceof Date) {
		dateValue = dateValue.valueOf();
	}

	// distance from Earth to Sun in km
	const sunDistance = 149598000;
	const days = toDays(dateValue);
	const sunCoords = calcSunCoordinates(days);
	const moonCoords = calcMoonCoordinates(days);

	const phi = Math.acos(
		Math.sin(sunCoords.dec) * Math.sin(moonCoords.dec) +
		Math.cos(sunCoords.dec) * Math.cos(moonCoords.dec) * Math.cos(sunCoords.ra - moonCoords.ra)
	);

	const inc = Math.atan2(
		sunDistance * Math.sin(phi),
		moonCoords.dist - sunDistance * Math.cos(phi)
	);

	const angle = Math.atan2(
		Math.cos(sunCoords.dec) * Math.sin(sunCoords.ra - moonCoords.ra),
		Math.sin(sunCoords.dec) * Math.cos(moonCoords.dec) -
		Math.cos(sunCoords.dec) * Math.sin(moonCoords.dec) * Math.cos(sunCoords.ra - moonCoords.ra)
	);

	const phaseValue = 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI;

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
		phase,
		phaseValue,
		angle: toDegrees(angle, degrees)
	};
}
