import { getJulianMillennium } from "../utils/julian-day";
import { COEFFICIENTS_R0, COEFFICIENTS_R1, COEFFICIENTS_R2, COEFFICIENTS_R3, COEFFICIENTS_R4 } from "./coefficients";

import type { AstronomicalUnit, JulianDay } from "../types";

/**
 * Radius vector (distance from the Sun).
 */
export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
	const tau = getJulianMillennium(jd);

	const R0 = (COEFFICIENTS_R0).reduce((sum, val) => sum + (val[0] * Math.cos(val[1] + val[2] * tau)), 0);
	const R1 = (COEFFICIENTS_R1).reduce((sum, val) => sum + (val[0] * Math.cos(val[1] + val[2] * tau)), 0);
	const R2 = (COEFFICIENTS_R2).reduce((sum, val) => sum + (val[0] * Math.cos(val[1] + val[2] * tau)), 0);
	const R3 = (COEFFICIENTS_R3).reduce((sum, val) => sum + (val[0] * Math.cos(val[1] + val[2] * tau)), 0);
	const R4 = (COEFFICIENTS_R4).reduce((sum, val) => sum + (val[0] * Math.cos(val[1] + val[2] * tau)), 0);

	const value = R0 + R1 * tau + R2 * Math.pow(tau, 2) + R3 * Math.pow(tau, 3) + R4 * Math.pow(tau, 4);
	return value / 1e8;
}
