import { Show } from "solid-js";

import { GaugeTime } from "~/entities/gauge";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { Card, Text } from "~/shared/ui";

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
		<Card data-label="lights-schedule">
			<Card.Header>
				<Text as="h2" variant="heading-l">{t().TITLE.LIGHTS_DATA_BY_DATE}</Text>
			</Card.Header>
			<Show when={schedule().status === "SCHEDULED"} fallback={<Text as="p" variant="text-s">{statusMessage()}</Text>}>
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
		</Card>
	);
}
