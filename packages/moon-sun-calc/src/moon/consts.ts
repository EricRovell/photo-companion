import type { MoonPhase } from "./types";

// first newMoon in the year 2000 2000-01-06 18:14
export const FIRST_NEW_MOON_2000 = 947178840000;

// The duration in days of a lunar cycle is 29.53058770576
export const LUNAR_DAYS_MS = 2551442778;
export const LUNAR_DAYS_MS_HALF = 2551442778 / 2;
export const LUNAR_DAYS_MS_QUARTER = 2551442778 / 4;

export const MOON_CYCLE_LIST: MoonPhase[] = [
	{
		from: 0,
		id: "NEW_MOON",
		to: 0.033863193308711,
		weight: 1
	},
	{
		from: 0.033863193308711,
		id: "WAXING_CRESCENT",
		to: 0.216136806691289,
		weight: 6.3825
	},
	{
		from: 0.216136806691289,
		id: "FIRST_QUARTER",
		to: 0.283863193308711,
		weight: 1
	},
	{
		from: 0.283863193308711,
		id: "WAXING_GIBBOUS",
		to: 0.466136806691289,
		weight: 6.3825
	},
	{
		from: 0.466136806691289,
		id: "FULL_MOON",
		to: 0.533863193308711,
		weight: 1
	},
	{
		from: 0.533863193308711,
		id: "WANING_GIBBOUS",
		to: 0.716136806691289,
		weight: 6.3825
	},
	{
		from: 0.716136806691289,
		id: "FIRST_QUARTER",
		to: 0.783863193308711,
		weight: 1
	},
	{
		from: 0.783863193308711,
		id: "WANING_CRESCENT",
		to: 0.966136806691289,
		weight: 6.3825
	},
	{
		from: 0.966136806691289,
		id: "NEW_MOON",
		to: 1,
		weight: 1
	}
];

export const MOON_NAMES = [
	"WOLF",
	"SNOW",
	"WORM",
	"PINK",
	"FLOWER",
	"STRAWBERRY",
	"BUCK",
	"STURGEON",
	"CORN",
	"HUNTER",
	"BEAVER",
	"COLD"
] as const;
