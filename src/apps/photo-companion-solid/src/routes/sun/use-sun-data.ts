import { getSunTimes, getSunPosition } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";
import { round } from "utils/math";

import { useTranslation } from "@lib/context";
import { useDatetime, useLocation } from "@lib/hooks";

export interface SunData {
	dayDuration: string,
	position: {
		altitude: string;
		azimuth: string;
		declination: string;
		zenith: string;
	},
	sunrise: number,
	sunset: number,
	goldenHourDawn: string;
	goldenHourDusk: string;
	blueHourDawn: string;
	blueHourDusk: string;
	nightStart: string;
	nightEnd: string;
}

interface Output {
	getSunData: () => SunData;
}

export function useSunData(): Output {
	const { getLatitude, getLongitude } = useLocation();
	const { date } = useDatetime();
	const { formatters } = useTranslation();

	const data = createMemo(() => {
		const suntimes = getSunTimes(date(), getLatitude(), getLongitude());

		return {
			position: getSunPosition(date(), getLatitude(), getLongitude(), true),
			suntimes,
			sunrise: suntimes.SUNRISE_START.timestamp,
			sunset: suntimes.SUNSET_END.timestamp
		};
	});

	const getSunData = (): SunData => {
		const { position, suntimes, sunrise, sunset } = data();

		return {
			dayDuration: formatters().formatTimeDuration(calcDuration(sunrise, sunset)),
			position: {
				altitude: formatters().formatDegrees(round(position.altitude, 1)),
				azimuth: formatters().formatDegrees(round(position.azimuth, 1)),
				declination: formatters().formatDegrees(round(position.declination, 1)),
				zenith: formatters().formatDegrees(round(position.zenith, 1))
			},
			sunrise,
			sunset,
			goldenHourDawn: [
				formatters().formatTimeShort(suntimes.GOLDEN_HOUR_START_DAWN.timestamp),
				"—",
				formatters().formatTimeShort(suntimes.GOLDEN_HOUR_END_DAWN.timestamp)
			].join(" "),
			goldenHourDusk: [
				formatters().formatTimeShort(suntimes.GOLDEN_HOUR_START_DUSK.timestamp),
				"—",
				formatters().formatTimeShort(suntimes.GOLDEN_HOUR_END_DUSK.timestamp)
			].join(" "),
			blueHourDawn: [
				formatters().formatTimeShort(suntimes.BLUE_HOUR_START_DAWN.timestamp),
				"—",
				formatters().formatTimeShort(suntimes.BLUE_HOUR_END_DAWN.timestamp)
			].join(" "),
			blueHourDusk: [
				formatters().formatTimeShort(suntimes.BLUE_HOUR_START_DUSK.timestamp),
				"—",
				formatters().formatTimeShort(suntimes.BLUE_HOUR_END_DUSK.timestamp)
			].join(" "),
			nightStart: formatters().formatTimeShort(suntimes.ASTRONOMICAL_DUSK.timestamp),
			nightEnd: formatters().formatTimeShort(suntimes.ASTRONOMICAL_DAWN.timestamp)
		};
	};

	return {
		getSunData
	};
}
