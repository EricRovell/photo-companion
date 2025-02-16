import { getSunPosition, getSunTimes } from "moon-sun-calc";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";
import { round } from "utils/math";

import { useDatetime } from "~/hooks";
import { useSettings } from "~/services/settings";
import { useTranslation } from "~/services/translation";

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
	const { format } = useTranslation();

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
				format().timeShort(suntimes.BLUE_HOUR_START_DAWN.timestamp),
				"—",
				format().timeShort(suntimes.BLUE_HOUR_END_DAWN.timestamp)
			].join(" "),
			blueHourDusk: [
				format().timeShort(suntimes.BLUE_HOUR_START_DUSK.timestamp),
				"—",
				format().timeShort(suntimes.BLUE_HOUR_END_DUSK.timestamp)
			].join(" "),
			dayDuration: format().timeDuration(calcDuration(sunrise, sunset)),
			goldenHourDawn: [
				format().timeShort(suntimes.GOLDEN_HOUR_START_DAWN.timestamp),
				"—",
				format().timeShort(suntimes.GOLDEN_HOUR_END_DAWN.timestamp)
			].join(" "),
			goldenHourDusk: [
				format().timeShort(suntimes.GOLDEN_HOUR_START_DUSK.timestamp),
				"—",
				format().timeShort(suntimes.GOLDEN_HOUR_END_DUSK.timestamp)
			].join(" "),
			nightEnd: format().timeShort(suntimes.ASTRONOMICAL_DAWN.timestamp),
			nightStart: format().timeShort(suntimes.ASTRONOMICAL_DUSK.timestamp),
			position: {
				altitude: format().degrees(round(position.altitude, 1)),
				azimuth: format().degrees(round(position.azimuth, 1)),
				declination: format().degrees(round(position.declination, 1)),
				zenith: format().degrees(round(position.zenith, 1))
			},
			sunrise,
			sunset
		};
	};

	return {
		getSunData
	};
}
