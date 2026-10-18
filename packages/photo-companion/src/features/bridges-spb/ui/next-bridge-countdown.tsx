import { createMemo } from "solid-js";

import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { createCountdown } from "~/shared/lib/timer";
import { PropertyList } from "~/shared/ui";

import { useBridges } from "../model";

/**
 * Renders countdown till the next bridge event.
 */
export function NextBridgeCountdown() {
	const { getTimestamp } = useDatetime();
	const { format, t } = useTranslation();
	const { getNextBridgeEvent } = useBridges();

	const getNextEvent = createMemo(() => getNextBridgeEvent(getTimestamp()));

	const time = createCountdown({
		getTimestampEnd: () => getNextEvent().timestamp,
		getTimestampStart: () => getTimestamp()
	});

	const property = () => {
		const { name, open } = getNextEvent();
		const event = open
			? t().BRIDGE_SPB_EVENT.CLOSE
			: t().BRIDGE_SPB_EVENT.OPEN;

		return format().message(event, {
			bridge: t().BRIDGE_NAME_SPB[name]
		});
	};

	return (
		<PropertyList.Item>
			<PropertyList.Label>
				{property()}
			</PropertyList.Label>
			<PropertyList.Value>
				{format().timeDuration(time())}
			</PropertyList.Value>
		</PropertyList.Item>
	);
}
