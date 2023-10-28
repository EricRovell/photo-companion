// @ts-expect-error: no types for this package
import SunCalc from "suncalc3";
import { round } from "../../helpers";

interface Time {
	angle: number;
	date: Date;
	time: string;
}

interface EphemeridesTime {
	sunrise: Time;
	sunset: Time;
	moonrise: Time;
	moonset: Time;
}

const calcTime = (date: Date): Time => {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const angle = Math.round(360 * (hours * 60 + minutes) / (24 * 60));

	return {
		angle,
		date,
		time: new Intl.DateTimeFormat("ru-RU", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		}).format(date)
	};
};

export const calcEphemeridesData = (date: Date = new Date, lat: number, lon: number): EphemeridesTime => {
	const dataSun = SunCalc.getSunTimes(date, lat, lon);
	const dataMoon = SunCalc.getMoonTimes(date, lat, lon);

	return {
		sunrise: calcTime(dataSun.sunriseStart.value),
		sunset: calcTime(dataSun.sunsetEnd.value),
		moonrise: calcTime(dataMoon.rise),
		moonset: calcTime(dataMoon.set)
	};
};

export const calcMoonIllumination = (date: Date = new Date()): number => {
	const value = SunCalc.getMoonIllumination(date).fraction;
	return round(value * 100, 1);
};
