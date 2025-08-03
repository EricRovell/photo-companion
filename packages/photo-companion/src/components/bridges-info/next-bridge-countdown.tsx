import { createMemo } from "solid-js";

import { CardEntry } from "~/components";
import { useBridges } from "~/features/bridges-spb";
import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { createCountdown } from "~/shared/lib/timer";

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
		return t().BRIDGE_SPB_EVENTS[`${name}_${open ? "CLOSE" : "OPEN"}`];
	};

	return (
		<CardEntry property={property()}>
			{format().timeDuration(time())}
		</CardEntry>
	);
}
