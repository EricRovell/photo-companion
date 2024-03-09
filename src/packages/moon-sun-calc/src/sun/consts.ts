import type { SunTimeEvent } from "../types";

export const SUN_TIMES: SunTimeEvent[] = [
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
