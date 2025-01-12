import { DAY_MS } from "../consts";

/**
* Calculates the astro refraction.
*/
export function astroRefraction(h: number): number {
	// the following formula works for positive altitudes only.
	if (h < 0) { 
		h = 0;
	}
	
	// if h = -0.08901179 a div/0 would occur.

	// formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
	// 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
	return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
}

/**
* Adds hours to a date.
*/
export function hoursLater(dateValue: number, hours: number): number {
	return dateValue + hours * DAY_MS / 24;
}
