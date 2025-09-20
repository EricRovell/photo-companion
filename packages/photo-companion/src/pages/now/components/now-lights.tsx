import { LightsCountdown } from "~/components/lights-countdown/lights-countdown";
import { CardInfo } from "~/entities/card-info";
import { SupportsLights, useCityLights } from "~/features/city-lights";
import { useTranslation } from "~/features/translation";

export const NowLightsInfo = () => {
	const { format, t } = useTranslation();
	const { getCity, getScheduleByDate, getStateByDate} = useCityLights();

	const duration = () => getScheduleByDate().duration;
	const getTimeOn = () => getScheduleByDate().LIGHTS_START;
	const getTimeOff = () => getScheduleByDate().LIGHTS_END;
	const lights = () => getStateByDate().lights;

	return (
		<CardInfo title={t().TITLE.LIGHTS_FULL}>
			<CardInfo.Entry property={t().LABEL.CITY}>
				{t().CITIES[getCity()]}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.LIGHTS_CITY}>
				<span data-text={lights() ? "success" : "danger"}>
					{lights() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
				</span>
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.TIME_OFF}>
				{format().time(getTimeOff())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.TIME_ON}>
				{format().time(getTimeOn())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.DURATION_LIGHTS}>
				{format().timeDuration(duration())}
			</CardInfo.Entry>
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
