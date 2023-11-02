// @ts-expect-error: no types for this package
import SunCalc from "suncalc3";
import type { SunEventName } from "../../../types";

interface SunTime {
	elevation: number;
	julian: number;
	name: string;
	pos: number;
	ts: number;
	valid: boolean;
	value: Date;
}

export interface SunTimes {
	astronomicalDawn: SunTime;
	amateurDawn: SunTime;
	nauticalDawn: SunTime;
	blueHourDawnStart: SunTime;
	civilDawn: SunTime;
	blueHourDawnEnd: SunTime;
	goldenHourDawnStart: SunTime;
	sunriseStart: SunTime;
	sunriseEnd: SunTime;
	goldenHourDawnEnd: SunTime;
	solarNoon: SunTime;
	goldenHourDuskStart: SunTime;
	sunsetStart: SunTime;
	sunsetEnd: SunTime;
	goldenHourDuskEnd: SunTime;
	blueHourDuskStart: SunTime;
	civilDusk: SunTime;
	blueHourDuskEnd: SunTime;
	nauticalDusk: SunTime;
	amateurDusk: SunTime;
	astronomicalDusk: SunTime;
	nadir: SunTime;
}

export const getSunData = (date: Date = new Date, lat: number, lon: number): SunTimes => {
	return SunCalc.getSunTimes(date, lat, lon);
};

export const getSunTimeline = (date: Date = new Date, lat: number, lon: number): Record<SunEventName, number>[] => {
	const data = getSunData(date, lat, lon);
	const events: Record<SunEventName, number>[] = [
		{
			name: "dawn:astronomical",
			timestamp: data.astronomicalDawn.ts
		},
		{
			name: "dawn:nautical",
			timestamp: data.nauticalDawn.ts
		},
		{
			name: "dawn:blue-hour:start",
			timestamp: data.blueHourDawnStart.ts
		},
		{
			name: "dawn:civil",
			timestamp: data.civilDawn.ts
		},
		{
			name: "dawn:golden-hour:start",
			timestamp: data.goldenHourDawnStart.ts
		},
		{
			name: "sunrise:start",
			timestamp: data.sunriseStart.ts
		},
		{
			name: "sunrise:end",
			timestamp: data.sunriseEnd.ts
		},
		{
			name: "dawn:golden-hour:end",
			timestamp: data.goldenHourDawnEnd.ts
		},
		{
			name: "solar-noon",
			timestamp: data.solarNoon.ts
		},
		{
			name: "dusk:golden-hour:start",
			timestamp: data.goldenHourDuskStart.ts
		},
		{
			name: "sunset:start",
			timestamp: data.sunsetStart.ts
		},
		{
			name: "sunset:end",
			timestamp: data.sunsetEnd.ts
		},
		{
			name: "dusk:golden-hour:end",
			timestamp: data.goldenHourDuskEnd.ts
		},
		{
			name: "dusk:blue-hour:start",
			timestamp: data.blueHourDuskStart.ts
		},
		{
			name: "dusk:civil",
			timestamp: data.civilDusk.ts
		},
		{
			name: "dusk:blue-hour:end",
			timestamp: data.blueHourDuskEnd.ts
		},
		{
			name: "dusk:nautical",
			timestamp: data.nauticalDusk.ts
		},
		{
			name: "dusk:astronomical",
			timestamp: data.astronomicalDusk.ts
		},
		{
			name: "nadir",
			timestamp: data.nadir.ts
		}
	];

	return events;
};
