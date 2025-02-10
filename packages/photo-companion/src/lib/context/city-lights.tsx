import { initLightsProvider, type LightsProvider } from "lights-schedule";
import { createContext, createMemo, type ParentProps, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import type { Accessor } from "solid-js";
import type { LightsCity } from "types";

import { useDatetime } from "~/lib/hooks";

import { useSettings } from "./settings";

interface CityLightsContextType extends Omit<LightsProvider, "city" | "year"> {
	getCity: Accessor<LightsCity>;
	getYear: Accessor<number>;
}

const CityLightsContext = createContext<CityLightsContextType>();

export function CityLightsProvider(props: ParentProps) {
	const { settings } = useSettings();
	const { getDatetime } = useDatetime();

	// @ts-expect-error TODO: manage type for fallback
	const getCityLightsProvider = createMemo(() => initLightsProvider(settings.city));

	const getYear = () => getCityLightsProvider().year;
	const getCity = () => getCityLightsProvider().city;
	const getStateByDate = createMemo(() => getCityLightsProvider().getStateByDate(getDatetime()));
	const getEventsByDate = createMemo(() => getCityLightsProvider().getEventsByDate(getDatetime()));
	const getScheduleByDate = createMemo(() => getCityLightsProvider().getScheduleByDate(getDatetime()));

	return (
		<CityLightsContext.Provider value={{
			getCity,
			getEventsByDate,
			getScheduleByDate,
			getStateByDate,
			getYear
		}}>
			{props.children}
		</CityLightsContext.Provider>
	);
}

export function useCityLights() {
	const value = useContext(CityLightsContext);

	if (isNullable(value)) {
		throw new Error("useCityLights must be used within Settings and CityLights providers.");
	}

	return value;
}
