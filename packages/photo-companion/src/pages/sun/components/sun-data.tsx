import { CardInfo } from "~/entities/card-info";
import { useSunService } from "~/features/sun";
import { useTranslation } from "~/features/translation";

export function SunData(props: { title?: string }) {
	const { format, t } = useTranslation();
	const { altitude, azimuth, dayDuration, declination, sunrise, sunset, zenith } = useSunService();

	return (
		<CardInfo title={props.title}>
			<CardInfo.Entry property={t().LABEL.SUNRISE_TIME}>
				{format().timeShort(sunrise())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.SUNSET_TIME}>
				{format().timeShort(sunset())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.DURATION_DAYLIGHT}>
				{format().timeDuration(dayDuration())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.ALTITUDE}>
				{format().degrees(altitude())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.AZIMUTH}>
				{format().degrees(azimuth())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.DECLINATION}>
				{format().degrees(declination())}
			</CardInfo.Entry>
			<CardInfo.Entry property={t().LABEL.ZENITH}>
				{format().degrees(zenith())}
			</CardInfo.Entry>
		</CardInfo>
	);
}
