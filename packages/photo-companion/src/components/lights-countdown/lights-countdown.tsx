import { CardEntry } from "~/components";
import { createCountdown, useDatetime } from "~/hooks";
import { useCityLights } from "~/services/city-lights";
import { useTranslation } from "~/services/translation";

/**
 * City lights countdown used as card entry.
 */
export function LightsCountdown(props: { lights: boolean }) {
	const { format, t } = useTranslation();
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
			{format().timeDuration(time())}
		</CardEntry>
	);
}
