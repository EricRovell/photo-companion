// @ts-expect-error: no types for this package
import SunCalc from "suncalc3";
import { calcEventDuration, incrementDateByDay, round, secondsToHoursAndMinutes } from "@lib/helpers";
import type { SunEventName, SunEvent } from "@lib/types";

const eventMapping = {
	astronomicalDawn: "dawn:astronomical",
	nauticalDawn: "dawn:nautical",
	blueHourDawnStart: "dawn:blue-hour:start",
	civilDawn: "dawn:civil",
	blueHourDawnEnd: "dawn:blue-hour:end",
	goldenHourDawnStart: "dawn:golden-hour:start",
	sunriseStart: "sunrise:start",
	sunriseEnd: "sunrise:end",
	goldenHourDawnEnd: "dawn:golden-hour:end",
	//solarNoon: "solar-noon",
	goldenHourDuskStart: "dusk:golden-hour:start",
	sunsetStart: "sunset:start",
	sunsetEnd: "sunset:end",
	goldenHourDuskEnd: "dusk:golden-hour:end",
	blueHourDuskStart: "dusk:blue-hour:start",
	civilDusk: "dusk:civil",
	blueHourDuskEnd: "dusk:blue-hour:end",
	nauticalDusk: "dusk:nautical",
	astronomicalDusk: "dusk:astronomical"
	//nadir: "nadir";
};

export const getSunData = (date: Date = new Date, lat: number, lon: number) => {
	const suntimes = SunCalc.getSunTimes(date, lat, lon);
	const sunrise: Date = suntimes.sunriseStart.value;
	const sunset: Date = suntimes.sunsetEnd.value;
	const dayDuration = secondsToHoursAndMinutes(calcEventDuration(sunrise, sunset));

	return {
		dayDuration,
		sunrise,
		sunset
	};
};

export const getSunEvents = (date: Date = new Date(), lat: number, lon: number): SunEvent[] => {
	const data = SunCalc.getSunTimes(date, lat, lon);
	// the API returns the "nadir" for the next date
	const nadir = SunCalc.getSunTimes(incrementDateByDay(date, -1), lat, lon).nadir;
	const positionNadir = SunCalc.getPosition(data.nadir.ts, lat, lon);
	const positionNoon = SunCalc.getPosition(data.solarNoon.ts, lat, lon);

	const sunEvents: SunEvent[] = [
		{
			name: "nadir",
			timestamp: nadir.ts,
			data: {
				azimuth: round(positionNadir.azimuthDegrees),
				elevation: round(positionNadir.altitudeDegrees, 1)
			}
		},
		{
			name: "solar-noon",
			timestamp: data.solarNoon.ts,
			data: {
				azimuth: round(positionNoon.azimuthDegrees),
				elevation: round(positionNoon.altitudeDegrees, 1)
			}
		}
	];

	for (const [ key, value ] of Object.entries(eventMapping)) {
		sunEvents.push({
			name: value as SunEventName,
			timestamp: data[key].ts,
			data: {
				azimuth: round(SunCalc.getPosition(data[key].ts, lat, lon).azimuthDegrees),
				elevation: data[key].elevation
			}
		});
	}

	return sunEvents;
};
