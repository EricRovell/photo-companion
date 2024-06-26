import type { LightsCity, LightsSchedule } from "types";

import { CardEntry, CardInfo } from "@lib/components";
import { useTranslation } from "@lib/context";
import { createCountdown, useDatetime, useLightsProvider } from "@lib/hooks";

interface Props {
	city: LightsCity;
	lights: boolean;
	schedule: LightsSchedule;
}

function LightsCountdown(props: { lights: boolean }) {
	const { formatters, t } = useTranslation();
	const { getLightsProvider } = useLightsProvider();
	const { getTimestamp } = useDatetime();
	const getLabel = () => props.lights
		? t().LABEL.TILL_TURNED_OFF
		: t().LABEL.TILL_TURNED_ON;

	const time = createCountdown({
		getTimestampEnd: () => getLightsProvider().getStateByDate().timestamp,
		getTimestampStart: () => getTimestamp()
	});

	return (
		<CardEntry property={getLabel()}>
			{formatters().formatTimeDuration(time())}
		</CardEntry>
	);
}

export const LightsInfo = (props: Props) => {
	const { formatters, t } = useTranslation();

	return (
		<CardInfo>
			<CardEntry property={t().LABEL.CITY}>
				{t().CITIES[props.city]}
			</CardEntry>
			<CardEntry property={t().LABEL.LIGHTS_CITY}>
				{props.lights ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
			</CardEntry>
			<CardEntry property={t().LABEL.DURATION_LIGHTS}>
				{formatters().formatTimeDuration(props.schedule.duration)}
			</CardEntry>
			<LightsCountdown lights={props.lights} />
		</CardInfo>
	);
};
