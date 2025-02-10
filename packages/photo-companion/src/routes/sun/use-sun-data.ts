import { getSunPosition, getSunTimes } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";
import { round } from "utils/math";

import { useSettings } from "~/lib/context/settings";
import { useTranslation } from "~/lib/context/translation";
import { useDatetime } from "~/lib/hooks";

export interface SunData {
	blueHourDawn: string;
	blueHourDusk: string;
	dayDuration: string,
	goldenHourDawn: string;
	goldenHourDusk: string;
	nightEnd: string;
	nightStart: string;
	position: {
		altitude: string;
		azimuth: string;
		declination: string;
		zenith: string;
	},
	sunrise: number,
	sunset: number,
}

interface Output {
	getSunData: () => SunData;
}

export function useSunData(): Output {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();
	const { formatters } = useTranslation();

	const data = createMemo(() => {
		const suntimes = getSunTimes(getDatetime(), settings.latitude, settings.longitude);

		return {
			position: getSunPosition(getDatetime(), settings.latitude, settings.longitude, true),
			sunrise: suntimes.SUNRISE_START.timestamp,
			sunset: suntimes.SUNSET_END.timestamp,
			suntimes
		};
	});

	const getSunData = (): SunData => {
		const { position, sunrise, sunset, suntimes } = data();

		return {
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
			dayDuration: formatters().formatTimeDuration(calcDuration(sunrise, sunset)),
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
			nightEnd: formatters().formatTimeShort(suntimes.ASTRONOMICAL_DAWN.timestamp),
			nightStart: formatters().formatTimeShort(suntimes.ASTRONOMICAL_DUSK.timestamp),
			position: {
				altitude: formatters().formatDegrees(round(position.altitude, 1)),
				azimuth: formatters().formatDegrees(round(position.azimuth, 1)),
				declination: formatters().formatDegrees(round(position.declination, 1)),
				zenith: formatters().formatDegrees(round(position.zenith, 1))
			},
			sunrise,
			sunset
		};
	};

	return {
		getSunData
	};
}
