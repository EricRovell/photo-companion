import { Show } from "solid-js";

import {
	getLightsScheduleStatusMessage,
	LightsCountdown,
	SupportsLights,
	useCityLights
} from "~/features/city-lights";
import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

export const NowLightsInfo = () => {
	const { format, t } = useTranslation();
	const { getCity, getScheduleByDate, getStateByDate} = useCityLights();

	const getSchedule = getScheduleByDate;

	const duration = () => getSchedule().duration ?? 0;
	const getTimeOn = () => getSchedule().LIGHTS_START ?? 0;
	const getTimeOff = () => getSchedule().LIGHTS_END ?? 0;
	const lights = () => getStateByDate().lights;

	const getSource = () => {
		if (getSchedule().source === "SCHEDULE") {
			return t().LABEL.OFFICIAL_SCHEDULE;
		}

		return getSchedule().uncertaintyMinutes > 0
			? `${t().LABEL.SOLAR_ESTIMATE} (±${format().minutes(getSchedule().uncertaintyMinutes)})`
			: t().LABEL.SOLAR_ESTIMATE;
	};

	const statusMessage = () => getLightsScheduleStatusMessage(getSchedule().status, t());

	return (
		<PropertyList>
			<PropertyList.Header>
				{t().TITLE.LIGHTS_FULL}
			</PropertyList.Header>
			<PropertyList.Body>
				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.CITY}</PropertyList.Label>
					<PropertyList.Value>{t().CITIES[getCity()]}</PropertyList.Value>
				</PropertyList.Item>
				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.DATA_SOURCE}</PropertyList.Label>
					<PropertyList.Value>{getSource()}</PropertyList.Value>
				</PropertyList.Item>
				<PropertyList.Item>
					<PropertyList.Label>{t().LABEL.LIGHTS_CITY}</PropertyList.Label>
					<PropertyList.Value>
						<span data-text={lights() ? "success" : "danger"}>
							{lights() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
						</span>
						<Show when={statusMessage()}>
							<br />
							<small>{statusMessage()}</small>
						</Show>
					</PropertyList.Value>
				</PropertyList.Item>
				<Show when={getSchedule().status === "SCHEDULED"}>
					<PropertyList.Item>
						<PropertyList.Label>{t().LABEL.TIME_OFF}</PropertyList.Label>
						<PropertyList.Value>{format().time(getTimeOff())}</PropertyList.Value>
					</PropertyList.Item>
					<PropertyList.Item>
						<PropertyList.Label>{t().LABEL.TIME_ON}</PropertyList.Label>
						<PropertyList.Value>{format().time(getTimeOn())}</PropertyList.Value>
					</PropertyList.Item>
					<PropertyList.Item>
						<PropertyList.Label>{t().LABEL.DURATION_LIGHTS}</PropertyList.Label>
						<PropertyList.Value>{format().timeDuration(duration())}</PropertyList.Value>
					</PropertyList.Item>
					<LightsCountdown lights={lights()} />
				</Show>
			</PropertyList.Body>
		</PropertyList>
	);
};

export const NowLights = () => (
	<SupportsLights>
		<NowLightsInfo />
	</SupportsLights>
);

export default NowLights;
