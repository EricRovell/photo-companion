import { CardEntry, CardInfo, LightsCountdown } from "@lib/components";
import { useCityLights, useTranslation } from "@lib/context";

export const LightsInfo = () => {
	const { getCity, getScheduleByDate, getStateByDate } = useCityLights();
	const { formatters, t } = useTranslation();

	return (
		<CardInfo>
			<CardEntry property={t().LABEL.CITY}>
				{t().CITIES[getCity()]}
			</CardEntry>
			<CardEntry property={t().LABEL.LIGHTS_CITY}>
				{getStateByDate().lights ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
			</CardEntry>
			<CardEntry property={t().LABEL.DURATION_LIGHTS}>
				{formatters().formatTimeDuration(getScheduleByDate().duration)}
			</CardEntry>
			<LightsCountdown lights={getStateByDate().lights} />
		</CardInfo>
	);
};
