import type { MoonPhase, SunTimeEvent } from "./types";

export const RAD = Math.PI / 180;
export const DEGREES = 180 / Math.PI;

// date/time constants and conversions
export const DAY_MS = 86400000; // 1000 * 60 * 60 * 24;
export const J1970 = 2440587.5;
export const J2000 = 2451545;
export const J0 = 0.0009;

// The duration in days of a lunar cycle is 29.53058770576
export const LUNAR_DAYS_MS = 2551442778;

// first newMoon in the year 2000 2000-01-06 18:14
export const FIRST_NEW_MOON_2000 = 947178840000;

export const EARTH_OBLIQUITY = RAD * 23.4397;

export const sunTimes: SunTimeEvent[] = [
	{
		angle: 6,
		riseName: "GOLDEN_HOUR_END_DAWN",
		setName: "GOLDEN_HOUR_START_DUSK"
	}, // GOLDEN_HOUR_2
	{
		angle: -0.3,
		riseName: "SUNRISE_END",
		setName: "SUNSET_START"
	}, // SUNRISE_END
	{
		angle: -0.833,
		riseName: "SUNRISE_START",
		setName: "SUNSET_END"
	}, // SUNRISE
	{
		angle: -1,
		riseName: "GOLDEN_HOUR_START_DAWN",
		setName: "GOLDEN_HOUR_END_DUSK"
	}, // GOLDEN_HOUR_1
	{
		angle: -4,
		riseName: "BLUE_HOUR_END_DAWN",
		setName: "BLUE_HOUR_START_DUSK"
	}, // BLUE_HOUR
	{
		angle: -6,
		riseName: "CIVIL_DAWN",
		setName: "CIVIL_DUSK"
	}, // DAWN
	{
		angle: -8,
		riseName: "BLUE_HOUR_START_DAWN",
		setName: "BLUE_HOUR_END_DUSK"
	}, // BLUE_HOUR
	{
		angle: -12,
		riseName: "NAUTICAL_DAWN",
		setName: "NAUTICAL_DUSK"
	}, // NAUTIC_DAWN
	{
		angle: -18,
		riseName: "ASTRONOMICAL_DAWN",
		setName: "ASTRONOMICAL_DUSK"
	} // ASTRO_DAWN
];

export const MOON_CYCLE_LIST: MoonPhase[] = [
	{
		from: 0,
		to: 0.033863193308711,
		id: "NEW_MOON",
		weight: 1
	},
	{
		from: 0.033863193308711,
		to: 0.216136806691289,
		id: "WANING_CRESCENT",
		weight: 6.3825
	},
	{
		from: 0.216136806691289,
		to: 0.283863193308711,
		id: "FIRST_QUARTER",
		weight: 1
	},
	{
		from: 0.283863193308711,
		to: 0.466136806691289,
		id: "WANING_GIBBOUS",
		weight: 6.3825
	},
	{
		from: 0.466136806691289,
		to: 0.533863193308711,
		id: "FULL_MOON",
		weight: 1
	},
	{
		from: 0.533863193308711,
		to: 0.716136806691289,
		id: "WANING_GIBBOUS",
		weight: 6.3825
	},
	{
		from: 0.716136806691289,
		to: 0.783863193308711,
		id: "FIRST_QUARTER",
		weight: 1
	},
	{
		from: 0.783863193308711,
		to: 0.966136806691289,
		id: "WANING_CRESCENT",
		weight: 6.3825
	},
	{
		from: 0.966136806691289,
		to: 1,
		id: "NEW_MOON",
		weight: 1
	}
];
