import { CardEntry, CardInfo } from "~/components";
import { useSunService } from "~/features/sun";
import { useTranslation } from "~/features/translation";

export function SunData(props: { title?: string }) {
	const { format, t } = useTranslation();
	const { altitude, azimuth, dayDuration, declination, sunrise, sunset, zenith } = useSunService();

	return (
		<CardInfo title={props.title}>
			<CardEntry property={t().LABEL.SUNRISE_TIME}>
				{format().timeShort(sunrise())}
			</CardEntry>
			<CardEntry property={t().LABEL.SUNSET_TIME}>
				{format().timeShort(sunset())}
			</CardEntry>
			<CardEntry property={t().LABEL.DURATION_DAYLIGHT}>
				{format().timeDuration(dayDuration())}
			</CardEntry>
			<CardEntry property={t().LABEL.ALTITUDE}>
				{format().degrees(altitude())}
			</CardEntry>
			<CardEntry property={t().LABEL.AZIMUTH}>
				{format().degrees(azimuth())}
			</CardEntry>
			<CardEntry property={t().LABEL.DECLINATION}>
				{format().degrees(declination())}
			</CardEntry>
			<CardEntry property={t().LABEL.ZENITH}>
				{format().degrees(zenith())}
			</CardEntry>
		</CardInfo>
	);
}
