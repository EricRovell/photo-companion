import { CardEntry, CardInfo } from "~/components";
import { LightsCountdown } from "~/components/lights-countdown/lights-countdown";
import { useCityLights } from "~/features/city-lights";
import { useTranslation } from "~/features/translation";

export const LightsInfo = () => {
	const { getCity, getScheduleByDate, getStateByDate } = useCityLights();
	const { format, t } = useTranslation();

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
				{format().timeDuration(getScheduleByDate().duration)}
			</CardEntry>
			<LightsCountdown lights={lightsOn()} />
		</CardInfo>
	);
};
