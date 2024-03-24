import { getSunTimes, getSunPosition } from "moon-sun-calc";
import { objectEntries } from "utils";
import { calcDuration } from "utils/date";
import { round } from "utils/math";
import type { SunEventName } from "types";
import type { SunEvent } from "types";

import { formatDegrees, formatTimeDuration, formatTimeShort } from "@stores/lang";

export const getSunData = (date: Date = new Date, lat: number, lon: number) => {
	const suntimes = getSunTimes(date, lat, lon);
	const position = getSunPosition(date, lat, lon, true);
	const sunrise = suntimes.SUNRISE_START.timestamp;
	const sunset = suntimes.SUNSET_END.timestamp;
	const dayDuration = formatTimeDuration(calcDuration(sunrise, sunset));

	return {
		dayDuration,
		position: {
			azimuth: formatDegrees(round(position.azimuth, 1)),
			altitude: formatDegrees(round(position.altitude, 1)),
			zenith: formatDegrees(round(position.zenith, 1)),
			declination: formatDegrees(round(position.declination, 1))
		},
		sunrise,
		sunset,
		goldenHourDawn: [
			formatTimeShort(suntimes.GOLDEN_HOUR_START_DAWN.timestamp),
			"—",
			formatTimeShort(suntimes.GOLDEN_HOUR_END_DAWN.timestamp)
		].join(" "),
		goldenHourDusk: [
			formatTimeShort(suntimes.GOLDEN_HOUR_START_DUSK.timestamp),
			"—",
			formatTimeShort(suntimes.GOLDEN_HOUR_END_DUSK.timestamp)
		].join(" "),
		blueHourDawn: [
			formatTimeShort(suntimes.BLUE_HOUR_START_DAWN.timestamp),
			"—",
			formatTimeShort(suntimes.BLUE_HOUR_END_DAWN.timestamp)
		].join(" "),
		blueHourDusk: [
			formatTimeShort(suntimes.BLUE_HOUR_START_DUSK.timestamp),
			"—",
			formatTimeShort(suntimes.BLUE_HOUR_END_DUSK.timestamp)
		].join(" "),
		nightStart: formatTimeShort(suntimes.ASTRONOMICAL_DUSK.timestamp),
		nightEnd: formatTimeShort(suntimes.ASTRONOMICAL_DAWN.timestamp)
	};
};

export const getSunEvents = (date: Date = new Date(), lat: number, lon: number): SunEvent[] => {
	const data = getSunTimes(date, lat, lon);

	const sunEvents: SunEvent[] = [];

	for (const [ key, value ] of objectEntries(data)) {
		sunEvents.push({
			data: {
				azimuth: formatDegrees(round(getSunPosition(value.timestamp, lat, lon).azimuth, 1))
			},
			name: key as SunEventName,
			timestamp: value.timestamp,
			type: "SUN"
		});
	}

	return sunEvents;
};
