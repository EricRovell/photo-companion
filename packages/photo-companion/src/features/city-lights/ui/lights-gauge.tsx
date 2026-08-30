import { Show } from "solid-js";

import { GaugeTime } from "~/entities/gauge";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";

import { getLightsScheduleStatusMessage } from "../lib";
import { useCityLights } from "../model";
import { Bulb } from "./bulb/bulb";

export function LightGauge() {
	const { getScheduleByDate, getStateByDate } = useCityLights();
	const { getDatetime } = useDatetime();
	const { t } = useTranslation();
	const schedule = getScheduleByDate;
	const statusMessage = () => getLightsScheduleStatusMessage(schedule().status, t());

	return (
		<section class="card" data-label="lights-schedule">
			<header>
				<h2>{t().TITLE.LIGHTS_DATA_BY_DATE}</h2>
			</header>
			<Show when={schedule().status === "SCHEDULED"} fallback={<p>{statusMessage()}</p>}>
				<GaugeTime
					date={getDatetime()}
					timeEnd={new Date(schedule().LIGHTS_END ?? 0)}
					timeStart={new Date(schedule().LIGHTS_START ?? 0)}
				>
					<Bulb
						glow={getStateByDate().lights}
						height="20"
						width="20"
						x="-10"
						y="-10"
					/>
				</GaugeTime>
			</Show>
		</section>
	);
}
