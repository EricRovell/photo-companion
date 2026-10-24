import { CityLightsWidget } from "~/entities/widget-city-lights";
import { useDatetime } from "~/features/datetime-query";
import { LinkQuery } from "~/features/navigation";
import { ROUTES } from "~/shared/consts";
import { createQueryDate } from "~/shared/lib/query-date";

import { useCityLights } from "../model";

export function LightsSchedule() {
	const { getCity, getScheduleByDate, getScheduleForDate, getStateByDate } = useCityLights();
	const { getDatetime } = useDatetime();

	return (
		<CityLightsWidget
			city={getCity()}
			date={getDatetime()}
			getScheduleForDate={getScheduleForDate}
			renderTime={(date, children, label) => (
				<LinkQuery
					aria-label={label}
					href={ROUTES.LIGHTS}
					noScroll
					query={new URLSearchParams({ datetime: createQueryDate(date) })}
				>
					{children}
				</LinkQuery>
			)}
			schedule={getScheduleByDate()}
			state={getStateByDate()}
		/>
	);
}
