import { initLightsProvider } from "lights-schedule";
import { createContext, createMemo } from "solid-js";

import { createProvider } from "~/helpers/create-provider";
import { useDatetime } from "~/hooks";
import { useSettings } from "~/services/settings";

function createCityLightsState() {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	// @ts-expect-error TODO: manage type for fallback
	const getCityLightsProvider = createMemo(() => initLightsProvider(settings.city));

	const getYear = () => getCityLightsProvider().year;
	const getCity = () => getCityLightsProvider().city;
	const getStateByDate = createMemo(() => getCityLightsProvider().getStateByDate(getDatetime()));
	const getEventsByDate = createMemo(() => getCityLightsProvider().getEventsByDate(getDatetime()));
	const getScheduleByDate = createMemo(() => getCityLightsProvider().getScheduleByDate(getDatetime()));

	// To specify the date
	const getEventsByDateInput = createMemo(() => getCityLightsProvider().getEventsByDate);

	return {
		getCity,
		getEventsByDate,
		getEventsByDateInput,
		getScheduleByDate,
		getStateByDate,
		getYear
	};
}

const CityLightsContext = createContext<ReturnType<typeof createCityLightsState>>();

export const [ CityLightsProvider, useCityLights ] = createProvider({
	consumerName: "useCityLights",
	Context: CityLightsContext,
	getValue: createCityLightsState,
	providerName: "CityLights"
});
