import { CardEntry, CardInfo } from "@lib/components";
import type { MoonData as MoonDataType } from "../../services/moon";
import { t } from "@lib/stores/lang";

interface MoonDataProps {
	state: MoonDataType;
}

export const MoonData = (props: MoonDataProps) => (
	<CardInfo>
		<CardEntry property={t().LABEL.MOON_PHASE}>
			{t().MOON_PHASE[props.state.name]}
		</CardEntry>
		<CardEntry property={t().LABEL.MOON_ILLUMINATION}>
			{props.state.fraction}
		</CardEntry>
		<CardEntry property={t().LABEL.ZENITH}>
			{props.state.zenith}
		</CardEntry>
		<CardEntry property={t().LABEL.ALTITUDE}>
			{props.state.altitude}
		</CardEntry>
		<CardEntry property={t().LABEL.AZIMUTH}>
			{props.state.azimuth}
		</CardEntry>
		<CardEntry property={t().LABEL.DISTANCE}>
			{props.state.distance}
		</CardEntry>
		<CardEntry property={t().LABEL.PARALLACTIC_ANGLE}>
			{props.state.parallacticAngle}
		</CardEntry>
	</CardInfo>
);
