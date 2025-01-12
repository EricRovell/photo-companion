import { CardEntry, CardInfo } from "@lib/components";
import { useTranslation } from "@lib/context/translation";

import { useSunData } from "../../sun/use-sun-data";

export function NowSun() {
	const { formatters, t } = useTranslation();
	const { getSunData } = useSunData();

	return (
		<CardInfo title={t().TITLE.SUN}>
			<CardEntry property={t().LABEL.SUNRISE_TIME}>
				{formatters().formatTimeShort(getSunData().sunrise)}
			</CardEntry>
			<CardEntry property={t().LABEL.SUNSET_TIME}>
				{formatters().formatTimeShort(getSunData().sunset)}
			</CardEntry>
			<CardEntry property={t().LABEL.DURATION_DAYLIGHT}>
				{getSunData().dayDuration}
			</CardEntry>
			<CardEntry property={t().LABEL.ALTITUDE}>
				{getSunData().position.altitude}
			</CardEntry>
			<CardEntry property={t().LABEL.AZIMUTH}>
				{getSunData().position.azimuth}
			</CardEntry>
		</CardInfo>
	);
}
