/**
 * Note:
 * 
 * The fixtures are in UTC, so the UTC options should be used.
 */

import type { SunEventName } from "types";

interface SolarFixture {
	event: SunEventName;
	timestamp: number;
}

export const DATE = new Date(Date.UTC(2013, 2, 5, 0, 0, 0, 0));
export const LAT = 50.5; // 50° 30"
export const LNG = 30.5; // 30° 30"
export const HEIGHT = 2000;

// https://www.suncalc.org/#/-34,151,8/2013.03.06/11:00/1/0
export const LAT_SOUTHERN_HEMISPHERE = -34; // -34° - southern hemisphere
export const LNG_SOUTHERN_HEMISPHERE = 151; // 151° - southern hemisphere

export const TIMES_NORTH_HEMISPHERE: SolarFixture[] = [
	{
		event: "SOLAR_NOON",
		timestamp: Date.UTC(2013, 2, 5, 10, 10, 57)
	},
	{
		event: "NADIR",
		timestamp: Date.UTC(2013, 2, 5, 22, 10, 57)
	},
	{
		event: "SUNRISE_START",
		timestamp: Date.UTC(2013, 2, 5, 4, 34, 56)
	},
	{
		event: "SUNSET_END",
		timestamp: Date.UTC(2013, 2, 5, 15, 46, 57)
	},
	{
		event: "SUNRISE_END",
		timestamp: Date.UTC(2013, 2, 5, 4, 38, 19)
	},
	{
		event: "SUNSET_START",
		timestamp: Date.UTC(2013, 2, 5, 15, 43, 34)
	},
	{
		event: "CIVIL_DAWN",
		timestamp: Date.UTC(2013, 2, 5, 4, 2, 17)
	},
	{
		event: "CIVIL_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 16, 19, 36)
	},
	{
		event: "NAUTICAL_DAWN",
		timestamp: Date.UTC(2013, 2, 5, 3, 24, 31)
	},
	{
		event: "NAUTICAL_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 16, 57, 22)
	},
	{
		event: "ASTRONOMICAL_DAWN",
		timestamp: Date.UTC(2013, 2, 5, 2, 46, 17)
	},
	{
		event: "ASTRONOMICAL_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 17, 35, 36)
	},
	{
		event: "GOLDEN_HOUR_END_DAWN",
		timestamp: Date.UTC(2013, 2, 5, 5, 19, 1)
	},
	{
		event: "GOLDEN_HOUR_START_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 15, 2, 52)
	}
];

export const TIMES_SOUTH_HEMISPHERE: SolarFixture[] = [
	{
		event: "SOLAR_NOON",
		timestamp: Date.UTC(2013, 2, 5, 2, 9, 1, 832)
	},
	{
		event: "NADIR",
		timestamp: Date.UTC(2013, 2, 5, 14, 9, 1, 832)
	},
	{
		event: "GOLDEN_HOUR_START_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 7, 56,33, 416)
	},
	{
		event: "GOLDEN_HOUR_END_DAWN",
		timestamp: Date.UTC(2013, 2, 4, 20, 21, 30, 248)
	},
	{
		event: "SUNSET_START",
		timestamp: Date.UTC(2013, 2, 5, 8, 27, 5, 997)
	},
	{
		event: "SUNRISE_END",
		timestamp: Date.UTC(2013, 2, 4, 19, 50, 57, 667)
	},
	{
		event: "SUNSET_END",
		timestamp: Date.UTC(2013, 2, 5, 8, 29, 41, 731)
	},
	{
		event: "SUNRISE_START",
		timestamp: Date.UTC(2013, 2, 4, 19, 48, 21, 933)
	},
	{
		event: "GOLDEN_HOUR_END_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 8, 30, 30, 554)
	},
	{
		event: "GOLDEN_HOUR_START_DAWN",
		timestamp: Date.UTC(2013, 2, 4, 19, 47, 33, 110)
	},
	{
		event: "BLUE_HOUR_START_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 8, 45, 10, 179)
	},
	{
		event: "BLUE_HOUR_END_DAWN",
		timestamp: Date.UTC(2013, 2, 4, 19, 32, 53, 485)
	},
	{
		event: "CIVIL_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 8, 54, 59, 722)
	},
	{
		event: "CIVIL_DAWN",
		timestamp: Date.UTC(2013, 2, 4, 19, 23, 3, 942)
	},
	{
		event: "BLUE_HOUR_END_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 9, 4, 52, 263)
	},
	{
		event: "BLUE_HOUR_START_DAWN",
		timestamp: Date.UTC(2013, 2, 4, 19, 13, 11, 401)
	},
	{
		event: "NAUTICAL_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 9, 24, 48, 289)
	},
	{
		event: "NAUTICAL_DAWN",
		timestamp: Date.UTC(2013, 2, 4, 18, 53, 15, 375)
	},
	{
		event: "ASTRONOMICAL_DUSK",
		timestamp: Date.UTC(2013, 2, 5, 9, 55, 18, 657)
	},
	{
		event: "ASTRONOMICAL_DAWN",
		timestamp: Date.UTC(2013, 2, 4, 18, 22, 45, 7)
	}
];

export const HEIGHT_TIMES: SolarFixture[] = [
	{
		event: "SOLAR_NOON",
		timestamp: Date.UTC(2013, 2, 5, 10, 10, 57)
	},
	{
		event: "NADIR",
		timestamp: Date.UTC(2013, 2, 5, 22, 10, 57)
	},
	{
		event: "SUNRISE_START",
		timestamp: Date.UTC(2013, 2, 5, 4, 25, 7)
	},
	{
		event: "SUNSET_END",
		timestamp: Date.UTC(2013, 2, 5, 15, 56, 46)
	}
];
