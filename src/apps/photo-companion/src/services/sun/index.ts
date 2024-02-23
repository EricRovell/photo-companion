import { getSunTimes, getSunPosition } from "moon-sun-calc";
import { round, secondsToHoursAndMinutes } from "@lib/helpers";
import { calcDuration, incrementDateByDay } from "@shared/utils";
import type { SunEventName } from "@shared/types";
import type { SunEvent } from "@shared/types";

export const getSunData = (date: Date = new Date, lat: number, lon: number) => {
	const suntimes = getSunTimes(date, lat, lon);
	const sunrise: Date = suntimes.SUNRISE_START.value;
	const sunset: Date = suntimes.SUNSET_END.value;
	const dayDuration = secondsToHoursAndMinutes(calcDuration(sunrise, sunset));

	return {
		dayDuration,
		sunrise,
		sunset
	};
};

export const getSunEvents = (date: Date = new Date(), lat: number, lon: number): SunEvent[] => {
	const data = getSunTimes(date, lat, lon);
	// the API returns the "NADIR" for the next date
	const nadir = getSunTimes(incrementDateByDay(date, -1), lat, lon).NADIR;
	const positionNadir = getSunPosition(data.NADIR.ts, lat, lon);
	const positionNoon = getSunPosition(data.SOLAR_NOON.ts, lat, lon);

	const sunEvents: SunEvent[] = [];
	const missedEventsSet = new Set<string>([
		"SOLAR_NOON",
		"NADIR"
	]);

	for (const [ key, value ] of Object.entries(data)) {
		if (missedEventsSet.has(key)) {
			continue;
		}

		sunEvents.push({
			data: {
				azimuth: round(getSunPosition(value.ts, lat, lon).azimuthDegrees),
				// TODO: manage elevation for solar noon and nadir
				elevation: value.elevation!
			},
			name: key as SunEventName,
			timestamp: value.ts,
			type: "SUN"
		});
	}

	sunEvents.push(
		{
			data: {
				azimuth: round(positionNadir.azimuthDegrees),
				elevation: round(positionNadir.altitudeDegrees, 1)
			},
			name: "NADIR",
			timestamp: nadir.ts,
			type: "SUN"
		},
		{
			data: {
				azimuth: round(positionNoon.azimuthDegrees),
				elevation: round(positionNoon.altitudeDegrees, 1)
			},
			name: "SOLAR_NOON",
			timestamp: data.SOLAR_NOON.ts,
			type: "SUN"
		}
	);

	return sunEvents;
};
