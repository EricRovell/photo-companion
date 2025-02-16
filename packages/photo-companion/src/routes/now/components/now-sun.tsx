import { CardEntry, CardInfo } from "~/components";
import { useTranslation } from "~/services/translation";

import { useSunData } from "../../sun/use-sun-data";

export function NowSun() {
	const { format, t } = useTranslation();
	const { getSunData } = useSunData();

	return (
		<CardInfo title={t().TITLE.SUN}>
			<CardEntry property={t().LABEL.SUNRISE_TIME}>
				{format().timeShort(getSunData().sunrise)}
			</CardEntry>
			<CardEntry property={t().LABEL.SUNSET_TIME}>
				{format().timeShort(getSunData().sunset)}
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
