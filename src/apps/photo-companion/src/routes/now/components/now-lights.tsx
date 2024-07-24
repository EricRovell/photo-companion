import { CardEntry, CardInfo, LightsCountdown, SupportsLights} from "@lib/components";
import { useCityLights, useTranslation } from "@lib/context";

export const NowLightsInfo = () => {
	const { formatters, t } = useTranslation();
	const { getCity, getScheduleByDate, getStateByDate} = useCityLights();

	const duration = () => getScheduleByDate().duration;
	const getTimeOn = () => getScheduleByDate().LIGHTS_START;
	const getTimeOff = () => getScheduleByDate().LIGHTS_END;
	const lights = () => getStateByDate().lights;

	return (
		<CardInfo title={t().TITLE.LIGHTS_FULL}>
			<CardEntry property={t().LABEL.CITY}>
				{t().CITIES[getCity()]}
			</CardEntry>
			<CardEntry property={t().LABEL.LIGHTS_CITY}>
				{lights() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
			</CardEntry>
			<CardEntry property={t().LABEL.TIME_OFF}>
				{formatters().formatTime(getTimeOff())}
			</CardEntry>
			<CardEntry property={t().LABEL.TIME_ON}>
				{formatters().formatTime(getTimeOn())}
			</CardEntry>
			<CardEntry property={t().LABEL.DURATION_LIGHTS}>
				{formatters().formatTimeDuration(duration())}
			</CardEntry>
			<LightsCountdown lights={lights()} />
		</CardInfo>
	);
};

export const NowLights = () => (
	<SupportsLights>
		<NowLightsInfo />
	</SupportsLights>
);

export default NowLights;
