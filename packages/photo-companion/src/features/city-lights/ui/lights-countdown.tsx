import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { createCountdown } from "~/shared/lib/timer";
import { PropertyList } from "~/shared/ui";

import { useCityLights } from "../model";

interface Props {
	class?: string;
	lights: boolean;
	valueClass?: string;
}

/**
 * City lights countdown used as card entry.
 */
export function LightsCountdown(props: Props) {
	const { format, t } = useTranslation();
	const { getTimestamp } = useDatetime();
	const { getStateByDate } = useCityLights();
	const getLabel = () => props.lights
		? t().LABEL.TILL_TURNED_OFF
		: t().LABEL.TILL_TURNED_ON;

	const time = createCountdown({
		getTimestampEnd: () => getStateByDate().timestamp ?? getTimestamp(),
		getTimestampStart: () => getTimestamp()
	});

	return (
		<PropertyList.Item class={props.class}>
			<PropertyList.Label>
				{getLabel()}
			</PropertyList.Label>
			<PropertyList.Value class={props.valueClass}>
				{format().timeDuration(time())}
			</PropertyList.Value>
		</PropertyList.Item>
	);
}
