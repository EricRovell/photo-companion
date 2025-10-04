import { LightsCountdown, useCityLights } from "~/features/city-lights";
import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

export const LightsInfo = () => {
	const { getCity, getScheduleByDate, getStateByDate } = useCityLights();
	const { format, t } = useTranslation();

	const lightsOn = () => getStateByDate().lights;

	return (
		<PropertyList>
			<PropertyList.Body>
				<PropertyList.Item>
					<PropertyList.Label>
						{t().LABEL.CITY}
					</PropertyList.Label>
					<PropertyList.Value>
						{t().CITIES[getCity()]}
					</PropertyList.Value>
				</PropertyList.Item>
				<PropertyList.Item>
					<PropertyList.Label>
						{t().LABEL.LIGHTS_CITY}
					</PropertyList.Label>
					<PropertyList.Value>
						<span data-text={lightsOn() ? "success" : "danger"}>
							{lightsOn() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
						</span>
					</PropertyList.Value>
				</PropertyList.Item>
				<PropertyList.Item>
					<PropertyList.Label>
						{t().LABEL.DURATION_LIGHTS}
					</PropertyList.Label>
					<PropertyList.Value>
						{format().timeDuration(getScheduleByDate().duration)}
					</PropertyList.Value>
				</PropertyList.Item>
				<LightsCountdown lights={lightsOn()} />
			</PropertyList.Body>
		</PropertyList>
	);
};
