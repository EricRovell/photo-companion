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
		riseName: "golden-hour:dawn:end",
		setName: "golden-hour:dusk:start"
	}, // GOLDEN_HOUR_2
	{
		angle: -0.3,
		riseName: "sunrise:end",
		setName: "sunset:start"
	}, // SUNRISE_END
	{
		angle: -0.833,
		riseName: "sunrise:start",
		setName: "sunset:end"
	}, // SUNRISE
	{
		angle: -1,
		riseName: "golden-hour:dawn:start",
		setName: "golden-hour:dusk:end"
	}, // GOLDEN_HOUR_1
	{
		angle: -4,
		riseName: "blue-hour:dawn:end",
		setName: "blue-hour:dusk:start"
	}, // BLUE_HOUR
	{
		angle: -6,
		riseName: "civil:dawn",
		setName: "civil:dusk"
	}, // DAWN
	{
		angle: -8,
		riseName: "blue-hour:dawn:start",
		setName: "blue-hour:dusk:end"
	}, // BLUE_HOUR
	{
		angle: -12,
		riseName: "nautical:dawn",
		setName: "nautical:dusk"
	}, // NAUTIC_DAWN
	{
		angle: -18,
		riseName: "astronomical:dawn",
		setName: "astronomical:dusk"
	} // ASTRO_DAWN
];

export const MOON_CYCLE_LIST: MoonPhase[] = [
	{
		from: 0,
		to: 0.033863193308711,
		id: "new-moon",
		weight: 1
	},
	{
		from: 0.033863193308711,
		to: 0.216136806691289,
		id: "waning-crescent",
		weight: 6.3825
	},
	{
		from: 0.216136806691289,
		to: 0.283863193308711,
		id: "first-quarter",
		weight: 1
	},
	{
		from: 0.283863193308711,
		to: 0.466136806691289,
		id: "waning-gibbous",
		weight: 6.3825
	},
	{
		from: 0.466136806691289,
		to: 0.533863193308711,
		id: "full-moon",
		weight: 1
	},
	{
		from: 0.533863193308711,
		to: 0.716136806691289,
		id: "waning-gibbous",
		weight: 6.3825
	},
	{
		from: 0.716136806691289,
		to: 0.783863193308711,
		id: "first-quarter",
		weight: 1
	},
	{
		from: 0.783863193308711,
		to: 0.966136806691289,
		id: "waning-crescent",
		weight: 6.3825
	},
	{
		from: 0.966136806691289,
		to: 1,
		id: "new-moon",
		weight: 1
	}
];