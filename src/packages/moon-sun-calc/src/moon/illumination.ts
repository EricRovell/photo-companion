import { calcSunCoordinates } from "../sun/coordinates";
import { toDays, toDegrees } from "../utils";
import { MOON_CYCLE_LIST } from "./consts";
import { calcMoonCoordinates } from "./coordinates";

import type { MoonIllumination, MoonPhase } from "./types";

/**
 * Calculates the illumination paramteters of the Moon.
 * The output angle values are in radians by default.
 *
 * based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
 * Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
 */
export function getMoonIllumination(dateValue: DateLike, degrees = false): MoonIllumination {
	if (dateValue instanceof Date) {
		dateValue = dateValue.valueOf();
	}

	// distance from Earth to Sun in km
	const sunDistance = 149598000;
	const days = toDays(dateValue);
	const sunCoords = calcSunCoordinates(days);
	const moonCoords = calcMoonCoordinates(days);

	const phi = Math.acos(
		Math.sin(sunCoords.declination) * Math.sin(moonCoords.declination) +
		Math.cos(sunCoords.declination) * Math.cos(moonCoords.declination) * Math.cos(sunCoords.rightAscension - moonCoords.rightAscension)
	);

	const inc = Math.atan2(
		sunDistance * Math.sin(phi),
		moonCoords.distance - sunDistance * Math.cos(phi)
	);

	const angle = Math.atan2(
		Math.cos(sunCoords.declination) * Math.sin(sunCoords.rightAscension - moonCoords.rightAscension),
		Math.sin(sunCoords.declination) * Math.cos(moonCoords.declination) -
		Math.cos(sunCoords.declination) * Math.sin(moonCoords.declination) * Math.cos(sunCoords.rightAscension - moonCoords.rightAscension)
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
		angle: toDegrees(angle, degrees),
		fraction: (1 + Math.cos(inc)) / 2,
		phase,
		phaseValue
	};
}
