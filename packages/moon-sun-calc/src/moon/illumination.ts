import { normalizeDegrees, toRadians, toTimestamp } from "../shared";
import { getSunGeocentricCoords } from "../sun/ephemeris";
import { moonGeocentric } from "./ephemeris";

import type { DateLike, Degree } from "../types";
import type { MoonIllumination, MoonPhaseName } from "./types";

function phaseName(value: number): MoonPhaseName {
	if (value < 1 / 16 || value >= 15 / 16) {
		return "NEW_MOON";
	}

	if (value < 3 / 16) {
		return "WAXING_CRESCENT";
	}

	if (value < 5 / 16) {
		return "FIRST_QUARTER";
	}

	if (value < 7 / 16) {
		return "WAXING_GIBBOUS";
	}

	if (value < 9 / 16) {
		return "FULL_MOON";
	}

	if (value < 11 / 16) {
		return "WANING_GIBBOUS";
	}

	if (value < 13 / 16) {
		return "THIRD_QUARTER";
	}

	return "WANING_CRESCENT";
}

export function getMoonIllumination(input: DateLike): MoonIllumination {
	const timestamp = toTimestamp(input);

	const sun = getSunGeocentricCoords(timestamp);
	const sunRightAscension = toRadians(sun.rightAscension);
	const sunDeclination = toRadians(sun.declination);
	const sunDistance = sun.distance;

	const moon = moonGeocentric(timestamp);
	const moonRightAscension = toRadians(moon.rightAscension);
	const moonDeclination = toRadians(moon.declination);

	const elongation = Math.acos(Math.min(1, Math.max(-1,
		Math.sin(sunDeclination) * Math.sin(moonDeclination)
		+ Math.cos(sunDeclination) * Math.cos(moonDeclination) * Math.cos(sunRightAscension - moonRightAscension)
	)));

	const incidence = Math.atan2(
		sunDistance * Math.sin(elongation),
		moon.distance - sunDistance * Math.cos(elongation)
	);

	const angle: Degree = Math.atan2(
		Math.cos(sunDeclination) * Math.sin(sunRightAscension - moonRightAscension),
		Math.sin(sunDeclination) * Math.cos(moonDeclination)
			- Math.cos(sunDeclination) * Math.sin(moonDeclination) * Math.cos(sunRightAscension - moonRightAscension)
	) * 180 / Math.PI;

	const phaseValue = normalizeDegrees(moon.eclipticLongitude - sun.eclipticLongitude) / 360;

	return {
		angle,
		fraction: (1 + Math.cos(incidence)) / 2,
		phase: phaseName(phaseValue),
		phaseValue,
		waxing: phaseValue < 0.5
	};
}
