import { CityLightsWidget } from "~/entities/widget-city-lights";
import { useDatetime } from "~/features/datetime-query";

import { useCityLights } from "../model";

export function LightsSchedule() {
	const { getCity, getScheduleByDate, getScheduleForDate, getStateByDate } = useCityLights();
	const { getDatetime } = useDatetime();

	return (
		<CityLightsWidget
			city={getCity()}
			date={getDatetime()}
			getScheduleForDate={getScheduleForDate}
			schedule={getScheduleByDate()}
			state={getStateByDate()}
		/>
	);
}
