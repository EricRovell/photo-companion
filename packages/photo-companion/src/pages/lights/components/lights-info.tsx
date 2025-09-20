import { LightsCountdown } from "~/components/lights-countdown/lights-countdown";
import { CardInfo } from "~/entities/card-info";
import { useCityLights } from "~/features/city-lights";
import { useTranslation } from "~/features/translation";

export const LightsInfo = () => {
	const { getCity, getScheduleByDate, getStateByDate } = useCityLights();
	const { format, t } = useTranslation();

	const lightsOn = () => getStateByDate().lights;

	return (
		<CardInfo>
			<CardInfo.Entry property={t().LABEL.CITY}>
				{t().CITIES[getCity()]}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.LIGHTS_CITY}>
				<span data-text={lightsOn() ? "success" : "danger"}>
					{lightsOn() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
				</span>
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.DURATION_LIGHTS}>
				{format().timeDuration(getScheduleByDate().duration)}
			</CardInfo.Entry>
			<LightsCountdown lights={lightsOn()} />
		</CardInfo>
	);
};
