import { CardEntry, CardInfo } from "~/lib/components";
import { LightsCountdown } from "~/lib/components/lights-countdown/lights-countdown";
import { useCityLights } from "~/lib/context/city-lights";
import { useTranslation } from "~/lib/context/translation";

export const LightsInfo = () => {
	const { getCity, getScheduleByDate, getStateByDate } = useCityLights();
	const { formatters, t } = useTranslation();

	const lightsOn = () => getStateByDate().lights;

	return (
		<CardInfo>
			<CardEntry property={t().LABEL.CITY}>
				{t().CITIES[getCity()]}
			</CardEntry>
			<CardEntry property={t().LABEL.LIGHTS_CITY}>
				<span data-text={lightsOn() ? "success" : "danger"}>
					{lightsOn() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
				</span>
			</CardEntry>
			<CardEntry property={t().LABEL.DURATION_LIGHTS}>
				{formatters().formatTimeDuration(getScheduleByDate().duration)}
			</CardEntry>
			<LightsCountdown lights={lightsOn()} />
		</CardInfo>
	);
};
