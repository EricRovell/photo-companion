import {
	deltaTSeconds,
	fromJulianDayUtc,
	toRadians,
	validateIntegerRange
} from "../shared";

import type { JulianDay } from "../types";
import type { SeasonEvent, SeasonEventName } from "./types";

const SEASON_TERMS = [
	[ 485, 324.96, 1934.136 ],
	[ 203, 337.23, 32_964.467 ],
	[ 199, 342.08, 20.186 ],
	[ 182, 27.85, 445_267.112 ],
	[ 156, 73.14, 45_036.886 ],
	[ 136, 171.52, 22_518.443 ],
	[ 77, 222.54, 65_928.934 ],
	[ 74, 296.72, 3034.906 ],
	[ 70, 243.58, 9037.513 ],
	[ 58, 119.81, 33_718.147 ],
	[ 52, 297.17, 150.678 ],
	[ 50, 21.02, 2281.226 ],
	[ 45, 247.54, 29_929.562 ],
	[ 44, 325.15, 31_555.956 ],
	[ 29, 60.93, 4443.417 ],
	[ 18, 155.12, 67_555.328 ],
	[ 17, 288.79, 4562.452 ],
	[ 16, 198.04, 62_894.029 ],
	[ 14, 199.76, 31_436.921 ],
	[ 12, 95.39, 14_577.848 ],
	[ 12, 287.11, 31_931.756 ],
	[ 12, 320.81, 34_777.259 ],
	[ 9, 227.73, 1222.114 ],
	[ 8, 15.45, 16_859.074 ]
] as const;

const SEASON_POLYNOMIALS: readonly (readonly [SeasonEventName, number, number, number, number, number])[] = [
	[ "EQUINOX_MARCH", 2_451_623.80984, 365_242.37404, 0.05169, -0.00411, -0.00057 ],
	[ "SOLSTICE_JUNE", 2_451_716.56767, 365_241.62603, 0.00325, 0.00888, -0.00030 ],
	[ "EQUINOX_SEPTEMBER", 2_451_810.21715, 365_242.01767, -0.11575, 0.00337, 0.00078 ],
	[ "SOLSTICE_DECEMBER", 2_451_900.05952, 365_242.74049, -0.06223, -0.00823, 0.00032 ]
];

function correctedJulianEphemerisDay(jde0: JulianDay): JulianDay {
	const T = (jde0 - 2_451_545) / 36_525;
	const W = toRadians(35_999.373 * T - 2.47);
	const longitudeCorrection = 1 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W);
	const periodicCorrection = SEASON_TERMS.reduce((sum, [ amplitude, phase, frequency ]) => {
		return sum + amplitude * Math.cos(toRadians(phase + frequency * T));
	}, 0);

	return jde0 + 0.00001 * periodicCorrection / longitudeCorrection;
}

function terrestrialToUtc(jde: JulianDay): Date {
	const approximate = fromJulianDayUtc(jde);
	const deltaT = deltaTSeconds(approximate.getTime());

	return fromJulianDayUtc(jde - deltaT / 86_400);
}

/** Returns the four equinoxes and solstices in the supplied UTC calendar year. */
export function getSeasonEvents(year: number): SeasonEvent[] {
	const validYear = validateIntegerRange({
		label: "Year",
		maximum: 2200,
		minimum: 1800,
		value: year
	});
	const Y = (validYear - 2000) / 1000;

	return SEASON_POLYNOMIALS.map(([ name, constant, linear, quadratic, cubic, quartic ]) => {
		const jde0 = constant
			+ linear * Y
			+ quadratic * Y ** 2
			+ cubic * Y ** 3
			+ quartic * Y ** 4;

		return {
			name,
			time: terrestrialToUtc(correctedJulianEphemerisDay(jde0))
		};
	});
}
