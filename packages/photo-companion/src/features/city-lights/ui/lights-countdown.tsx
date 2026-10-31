import { useCountdown } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

import { useCityLights } from "../model";

interface Props {
	lights: boolean;
}

/**
 * City lights countdown used as card entry.
 */
export function LightsCountdown(props: Props) {
	const { format, t } = useTranslation();
	const { getStateByDate } = useCityLights();
	const getLabel = () => props.lights
		? t().LABEL.TILL_TURNED_OFF
		: t().LABEL.TILL_TURNED_ON;

	const time = useCountdown(() => getStateByDate().timestamp);

	return (
		<PropertyList.Item>
			<PropertyList.Label>
				{getLabel()}
			</PropertyList.Label>
			<PropertyList.Value>
				{format().timeDuration(time())}
			</PropertyList.Value>
		</PropertyList.Item>
	);
}
