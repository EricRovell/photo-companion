import { findSunRiseSetIntervals, getSunPosition } from "moon-sun-calc";
import { createContext, createMemo } from "solid-js";
import { calcDuration } from "utils/date";

import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { createProvider } from "~/shared/lib/create-provider";
import { createRiseSetEvents } from "~/shared/lib/rise-set";

function createSunState() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	const observer = () => ({ latitude: settings.latitude, longitude: settings.longitude });
	const { rise: sunrise, riseSetTimes, set: sunset } = createRiseSetEvents({
		date: getDatetime,
		findIntervals: findSunRiseSetIntervals,
		observer
	});
	const position = createMemo(() => getSunPosition({ instant: getDatetime(), observer: observer() }));

	return {
		altitude: () => position().apparentAltitude,
		azimuth: () => position().azimuth,
		dayDuration: () => sunrise() && sunset() ? calcDuration(sunrise(), sunset()) : 0,
		declination: () => position().declination,
		distance: () => position().distance,
		riseSetTimes,
		sunrise,
		sunset,
		zenith: () => 90 - position().apparentAltitude
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
