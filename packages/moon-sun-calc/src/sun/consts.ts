import type { SunTimeEvent } from "./types";

export const SUN_TIMES: SunTimeEvent[] = [
	{
		angle: 6,
		riseName: "GOLDEN_HOUR_END_DAWN",
		setName: "GOLDEN_HOUR_START_DUSK"
	},
	{
		angle: -0.3,
		riseName: "SUNRISE_END",
		setName: "SUNSET_START"
	},
	{
		angle: -0.833,
		riseName: "SUNRISE_START",
		setName: "SUNSET_END"
	},
	{
		angle: -1,
		riseName: "GOLDEN_HOUR_START_DAWN",
		setName: "GOLDEN_HOUR_END_DUSK"
	},
	{
		angle: -4,
		riseName: "BLUE_HOUR_END_DAWN",
		setName: "BLUE_HOUR_START_DUSK"
	},
	{
		angle: -6,
		riseName: "CIVIL_DAWN",
		setName: "CIVIL_DUSK"
	},
	{
		angle: -8,
		riseName: "BLUE_HOUR_START_DAWN",
		setName: "BLUE_HOUR_END_DUSK"
	},
	{
		angle: -12,
		riseName: "NAUTICAL_DAWN",
		setName: "NAUTICAL_DUSK"
	},
	{
		angle: -18,
		riseName: "ASTRONOMICAL_DAWN",
		setName: "ASTRONOMICAL_DUSK"
	}
];
