import { CardEntry } from "~/components";
import { useCityLights } from "~/features/city-lights";
import { useTranslation } from "~/features/translation";
import { useDatetime } from "~/hooks";
import { createCountdown } from "~/shared/lib/timer";

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
