import { getNextBridgeEvent } from "bridge-schedule";
import { createMemo} from "solid-js";

import { CardEntry } from "@lib/components";
import { useTranslation } from "@lib/context/translation";
import { createCountdown, useDatetime } from "@lib/hooks";

/**
 * Renders countdown till the next bridge event.
 */
export function NextBridgeCountdown() {
	const { getTimestamp } = useDatetime();
	const { formatters, t } = useTranslation();

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
			{formatters().formatTimeDuration(time())}
		</CardEntry>
	);
}
