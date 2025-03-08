import { getSunPosition, getSunTimes } from "moon-sun-calc";
import { createContext } from "solid-js";
import { createMemo } from "solid-js";
import { calcDuration } from "utils/date";

import { createProvider } from "~/helpers/create-provider";
import { useDatetime } from "~/hooks";
import { useSettings } from "~/services/settings";

function createSunState() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	const times = createMemo(() => getSunTimes(getDatetime(), settings.latitude, settings.longitude));
	const position = createMemo(() => getSunPosition(getDatetime(), settings.latitude, settings.longitude, true));

	return {
		altitude: () => position().altitude,
		azimuth: () => position().azimuth,
		dayDuration: () => calcDuration(times().SUNRISE_START.timestamp, times().SUNSET_END.timestamp),
		declination: () => position().declination,
		sunrise: () => times().SUNRISE_START.timestamp,
		sunset: () => times().SUNSET_END.timestamp,
		zenith: () => position().zenith
	};

	// TODO: use this info
	/* const getSunData = (): SunData => {
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
			nightStart: format().timeShort(suntimes.ASTRONOMICAL_DUSK.timestamp)
		};
	}; */
}

const SunServiceContext = createContext<ReturnType<typeof createSunState>>();

export const [ SunProvider, useSunService ] = createProvider({
	consumerName: "useSunService",
	Context: SunServiceContext,
	getValue: createSunState,
	providerName: "Sun"
});
