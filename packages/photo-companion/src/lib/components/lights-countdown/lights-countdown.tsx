import { CardEntry } from "~/lib/components";
import { createCountdown, useDatetime } from "~/lib/hooks";
import { useCityLights } from "~/services/city-lights";
import { useTranslation } from "~/services/translation";

/**
 * City lights countdown used as card entry.
 */
export function LightsCountdown(props: { lights: boolean }) {
	const { formatters, t } = useTranslation();
	const { getTimestamp } = useDatetime();
	const { getStateByDate } = useCityLights();
	const getLabel = () => props.lights
		? t().LABEL.TILL_TURNED_OFF
		: t().LABEL.TILL_TURNED_ON;

	const time = createCountdown({
		getTimestampEnd: () => getStateByDate().timestamp,
		getTimestampStart: () => getTimestamp()
	});

	return (
		<CardEntry property={getLabel()}>
			{formatters().formatTimeDuration(time())}
		</CardEntry>
	);
}
