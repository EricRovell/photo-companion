import { getSunTimes, getSunPosition } from "moon-sun-calc";
import { formatDegrees, formatTime, formatTimeShort } from "utils/formatters";
import { calcDuration, incrementDateByDay } from "utils/date";
import { round } from "utils/math";
import type { SunEventName } from "@shared/types";
import type { SunEvent } from "@shared/types";

export const getSunData = (date: Date = new Date, lat: number, lon: number) => {
	const suntimes = getSunTimes(date, lat, lon);
	const position = getSunPosition(date, lat, lon);
	const sunrise: Date = suntimes.SUNRISE_START.value;
	const sunset: Date = suntimes.SUNSET_END.value;
	const dayDuration = formatTime(calcDuration(sunrise, sunset));

	return {
		dayDuration,
		position: {
			azimuth: formatDegrees(round(position.azimuthDegrees, 2)),
			altitude: formatDegrees(round(position.altitudeDegrees, 2)),
			zenith: formatDegrees(round(position.zenithDegrees, 2)),
			declination: formatDegrees(round(position.declinationDegrees, 2))
		},
		sunrise,
		sunset,
		goldenHourDawn: [
			formatTimeShort(suntimes.GOLDEN_HOUR_START_DAWN.value),
			"—",
			formatTimeShort(suntimes.GOLDEN_HOUR_END_DAWN.value)
		].join(" "),
		goldenHourDusk: [
			formatTimeShort(suntimes.GOLDEN_HOUR_START_DUSK.value),
			"—",
			formatTimeShort(suntimes.GOLDEN_HOUR_END_DUSK.value)
		].join(" "),
		blueHourDawn: [
			formatTimeShort(suntimes.BLUE_HOUR_START_DAWN.value),
			"—",
			formatTimeShort(suntimes.BLUE_HOUR_END_DAWN.value)
		].join(" "),
		blueHourDusk: [
			formatTimeShort(suntimes.BLUE_HOUR_START_DUSK.value),
			"—",
			formatTimeShort(suntimes.BLUE_HOUR_END_DUSK.value)
		].join(" "),
		nightStart: formatTimeShort(suntimes.ASTRONOMICAL_DUSK.value),
		nightEnd: formatTimeShort(suntimes.ASTRONOMICAL_DAWN.value)
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
				azimuth: formatDegrees(round(getSunPosition(value.ts, lat, lon).azimuthDegrees)),
				// TODO: manage elevation for solar noon and nadir
				elevation: formatDegrees(round(value.elevation!, 2))
			},
			name: key as SunEventName,
			timestamp: value.ts,
			type: "SUN"
		});
	}

	sunEvents.push(
		{
			data: {
				azimuth: formatDegrees(round(positionNadir.azimuthDegrees, 2)),
				elevation: formatDegrees(round(positionNadir.altitudeDegrees, 2))
			},
			name: "NADIR",
			timestamp: nadir.ts,
			type: "SUN"
		},
		{
			data: {
				azimuth: formatDegrees(round(positionNoon.azimuthDegrees, 2)),
				elevation: formatDegrees(round(positionNoon.altitudeDegrees, 2))
			},
			name: "SOLAR_NOON",
			timestamp: data.SOLAR_NOON.ts,
			type: "SUN"
		}
	);

	return sunEvents;
};
