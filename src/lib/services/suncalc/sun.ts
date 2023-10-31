// @ts-expect-error: no types for this package
import SunCalc from "suncalc3";

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

export const getSunData = (date: Date = new Date, lat: number, lon: number): SunData => {
	return SunCalc.getSunTimes(date, lat, lon);
};
