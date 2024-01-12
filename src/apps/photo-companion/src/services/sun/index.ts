import { getSunTimes, getSunPosition } from "moon-sun-calc";
import { calcEventDuration, incrementDateByDay, round, secondsToHoursAndMinutes } from "@lib/helpers";
import type { SunEventName } from "@shared/types";
import type { SunEvent } from "@lib/types";

export const getSunData = (date: Date = new Date, lat: number, lon: number) => {
	const suntimes = getSunTimes(date, lat, lon);
	const sunrise: Date = suntimes["sunrise:start"].value;
	const sunset: Date = suntimes["sunset:end"].value;
	const dayDuration = secondsToHoursAndMinutes(calcEventDuration(sunrise, sunset));

	return {
		dayDuration,
		sunrise,
		sunset
	};
};

export const getSunEvents = (date: Date = new Date(), lat: number, lon: number): SunEvent[] => {
	const data = getSunTimes(date, lat, lon);
	// the API returns the "nadir" for the next date
	const nadir = getSunTimes(incrementDateByDay(date, -1), lat, lon).nadir;
	const positionNadir = getSunPosition(data["nadir"].ts, lat, lon);
	const positionNoon = getSunPosition(data["solar-noon"].ts, lat, lon);

	const sunEvents: SunEvent[] = [];
	const missedEventsSet = new Set<string>([
		"solar-noon",
		"nadir"
	]);

	for (const [ key, value ] of Object.entries(data)) {
		if (missedEventsSet.has(key)) {
			continue;
		}

		sunEvents.push({
			name: key as SunEventName,
			timestamp: value.ts,
			data: {
				azimuth: round(getSunPosition(value.ts, lat, lon).azimuthDegrees),
				// TODO: manage elevation for solar noon and nadir
				elevation: value.elevation!
			}
		});
	}

	sunEvents.push(
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
			timestamp: data["solar-noon"].ts,
			data: {
				azimuth: round(positionNoon.azimuthDegrees),
				elevation: round(positionNoon.altitudeDegrees, 1)
			}
		}
	);

	return sunEvents;
};
