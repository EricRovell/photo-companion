import { LightsCountdown, SupportsLights, useCityLights } from "~/features/city-lights";
import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

export const NowLightsInfo = () => {
	const { format, t } = useTranslation();
	const { getCity, getScheduleByDate, getStateByDate} = useCityLights();

	const duration = () => getScheduleByDate().duration;
	const getTimeOn = () => getScheduleByDate().LIGHTS_START;
	const getTimeOff = () => getScheduleByDate().LIGHTS_END;
	const lights = () => getStateByDate().lights;

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
					<PropertyList.Label>{t().LABEL.LIGHTS_CITY}</PropertyList.Label>
					<PropertyList.Value>
						<span data-text={lights() ? "success" : "danger"}>
							{lights() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
						</span>
					</PropertyList.Value>
				</PropertyList.Item>
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
