import { getSunEvents, getSunPosition } from "moon-sun-calc";
import { createContext } from "solid-js";
import { createMemo } from "solid-js";
import { calcDuration, getDayStart, shiftDate } from "utils/date";

import { useDatetime } from "~/features/datetime-query";
import { useSettings } from "~/features/settings";
import { createProvider } from "~/shared/lib/create-provider";

function createSunState() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	const observer = () => ({ latitude: settings.latitude, longitude: settings.longitude });

	const times = createMemo(() => {
		const start = getDayStart(getDatetime());

		return getSunEvents({
			interval: { end: shiftDate(start, "day", 1).getTime(), start },
			observer: observer()
		});
	});

	const position = createMemo(() => getSunPosition({ instant: getDatetime(), observer: observer() }));
	const sunrise = () => times().find(event => event.name === "SUNRISE_START")?.time ?? null;
	const sunset = () => times().find(event => event.name === "SUNSET_END")?.time ?? null;

	return {
		altitude: () => position().apparentAltitude,
		azimuth: () => position().azimuth,
		dayDuration: () => sunrise() && sunset() ? calcDuration(sunrise(), sunset()) : 0,
		declination: () => position().declination,
		distance: () => position().distance,
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
