import { CardEntry, CardInfo } from "@lib/components";
import type { SunData as SunDataType } from "../../services/sun";
import { t } from "@lib/stores/lang";

interface SunDataProps {
	state: SunDataType;
}

export const SunData = (props: SunDataProps) => (
	<CardInfo>
		<CardEntry property={t().LABEL.DURATION_DAYLIGHT}>
			{props.state.dayDuration}
		</CardEntry>
		<CardEntry property={t().LABEL.ALTITUDE}>
			{props.state.position.altitude}
		</CardEntry>
		<CardEntry property={t().LABEL.AZIMUTH}>
			{props.state.position.zenith}
		</CardEntry>
		<CardEntry property={t().LABEL.DECLINATION}>
			{props.state.position.declination}
		</CardEntry>
		<CardEntry property={t().LABEL.ZENITH}>
			{props.state.position.zenith}
		</CardEntry>
	</CardInfo>
);