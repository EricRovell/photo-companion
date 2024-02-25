import { RAD, DEGREES, MOON_CYCLE_LIST, LUNAR_DAYS_MS, FIRST_NEW_MOON_2000 } from "./consts";
import {
	rightAscension,
	declination,
	astroRefraction,
	siderealTime,
	altitudeCalc,
	toDays,
	azimuthCalc,
	hoursLater,
	calcSunCoordinates
} from "./utils";
import type {
	MoonPosition,
	MoonIllumination,
	MoonTimes,
	MoonData,
	MoonPhase
} from "./types";

// moon calculations, based on http://aa.quae.nl/en/reken/hemelpositie.html formulas

/**
 * Calculates the geocentric ecliptic coordinates of the moon from the number of days.
 */
function calcMoonCoordinates(days: number) {
	const eclipticLongitude = RAD * (218.316 + 13.176396 * days);
	const meanAnomaly = RAD * (134.963 + 13.064993 * days);
	const meanDistance = RAD * (93.272 + 13.229350 * days);
	const longitude = eclipticLongitude + RAD * 6.289 * Math.sin(meanAnomaly);
	const latitude = RAD * 5.128 * Math.sin(meanDistance);
	const distanceToTheMoonInKm = 385001 - 20905 * Math.cos(meanAnomaly);

	return {
		ra: rightAscension(longitude, latitude),
		dec: declination(longitude, latitude),
		dist: distanceToTheMoonInKm
	};
}

/**
 * Calculates moon position for a given date and latitude/longitude.
 */
export function getMoonPosition(dateValue: Date | number, lat: number, lng: number): MoonPosition {
	// console.log(`getMoonPosition dateValue=${dateValue}  lat=${lat}, lng=${lng}`);
	if (isNaN(lat)) {
		throw new Error("latitude missing");
	}

	if (isNaN(lng)) {
		throw new Error("longitude missing");
	}

	if (dateValue instanceof Date) {
		dateValue = dateValue.valueOf();
	}

	const lw = RAD * -lng;
	const phi = RAD * lat;
	const days = toDays(dateValue);
	const coords = calcMoonCoordinates(days);
	const H = siderealTime(days, lw) - coords.ra;
	let altitude = altitudeCalc(H, phi, coords.dec);

	// altitude correction for refraction
	altitude += astroRefraction(altitude);

	// formula 14.1 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
	const pa = Math.atan2(Math.sin(H), Math.tan(phi) * Math.cos(coords.dec) - Math.sin(coords.dec) * Math.cos(H));

	const azimuth = azimuthCalc(H, phi, coords.dec);

	return {
		azimuth,
		altitude,
		azimuthDegrees: DEGREES * azimuth,
		altitudeDegrees: DEGREES * altitude,
		distance: coords.dist,
		parallacticAngle: pa,
		parallacticAngleDegrees: DEGREES * pa
	};
}

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

/**
 * Calculations moon position and illumination for a given date and latitude/longitude of the moon,
 */
export function getMoonData(dateValue: Date | number, lat: number, lng: number): MoonData {
	const pos = getMoonPosition(dateValue, lat, lng);
	const illum = getMoonIllumination(dateValue);
	return Object.assign({
		illumination : illum,
		zenithAngle : illum.angle - pos.parallacticAngle
	}, pos);
}

/**
* Calculations for moon rise/set times are based on http://www.stargazing.net/kepler/moonrise.html article
*/
export function getMoonTimes(dateValue: Date | number, lat: number, lng: number, inUTC: boolean = false): MoonTimes {
	if (isNaN(lat)) {
		throw new Error("latitude missing");
	}

	if (isNaN(lng)) {
		throw new Error("longitude missing");
	}

	const t = new Date(dateValue);

	if (inUTC) {
		t.setUTCHours(0, 0, 0, 0);
	} else {
		t.setHours(0, 0, 0, 0);
	}

	dateValue = t.valueOf();

	const hc = 0.133 * RAD;
	let h0 = getMoonPosition(dateValue, lat, lng).altitude - hc;
	let rise;
	let set;
	let ye = 0;
	let d;
	let roots;
	let x1 = 0;
	let x2 = 0;
	let dx;

	// go in 2-hour chunks, each time seeing if a 3-point quadratic curve crosses zero (which means rise or set)
	for (let i = 1; i <= 24; i += 2) {
		const h1 = getMoonPosition(hoursLater(dateValue, i), lat, lng).altitude - hc;
		const h2 = getMoonPosition(hoursLater(dateValue, i + 1), lat, lng).altitude - hc;

		const a = (h0 + h2) / 2 - h1;
		const b = (h2 - h0) / 2;
		const xe = -b / (2 * a);
		ye = (a * xe + b) * xe + h1;
		d = b * b - 4 * a * h1;
		roots = 0;

		if (d >= 0) {
			dx = Math.sqrt(d) / (Math.abs(a) * 2);
			x1 = xe - dx;
			x2 = xe + dx;

			if (Math.abs(x1) <= 1) {
				roots++;
			}

			if (Math.abs(x2) <= 1) {
				roots++;
			}

			if (x1 < -1) {
				x1 = x2;
			}
		}

		if (roots === 1) {
			if (h0 < 0) {
				rise = i + x1;
			} else {
				set = i + x1;
			}
		} else if (roots === 2) {
			rise = i + (ye < 0 ? x2 : x1);
			set = i + (ye < 0 ? x1 : x2);
		}

		if (rise && set) {
			break;
		}

		h0 = h2;
	}

	const result: Partial<MoonTimes> = {};

	result.rise = rise
		? new Date(hoursLater(dateValue, rise))
		: null;

	result.set = set
		? new Date(hoursLater(dateValue, set))
		: null;

	if (!rise && !set) {
		if (ye > 0) {
			result.alwaysUp = true;
			result.alwaysDown = false;
		} else {
			result.alwaysUp = false;
			result.alwaysDown = true;
		}
	} else if (rise && set) {
		result.alwaysUp = false;
		result.alwaysDown = false;
		result.highest = new Date(hoursLater(dateValue, Math.min(rise, set) + (Math.abs(set - rise) / 2)));
	} else {
		result.alwaysUp = false;
		result.alwaysDown = false;
	}

	return result as MoonTimes;
}
