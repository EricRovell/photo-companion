import { getNavigationState } from "bridge-schedule";
import { createMemo } from "solid-js";

import { CardEntry } from "@lib/components";
import { useTranslation } from "@lib/context";
import { useDatetime } from "@lib/hooks";

/**
 * Renders navigation period related card entries.
 */
export function NavigationState() {
	const { formatters, t } = useTranslation();
	const { getTimestamp } = useDatetime();
	const getState = createMemo(() => getNavigationState(getTimestamp()));

	const getNavigationLabel = () => getState().navigation
		? t().LABEL.NAVIGATION_OPENED_SHORT
		: t().LABEL.NAVIGATION_CLOSED_SHORT;

	const subtitle = () => getState().navigation
		? t().MESSAGE.NAVIGATION_ENDS_AT
		: t().MESSAGE.NAVIGATION_STARTS_AT;

	const getValue = () => formatters().formatDays(getState().days);

	return (
		<>
			<CardEntry property={t().LABEL.NAVIGATION}>
				{getNavigationLabel()}
			</CardEntry>
			<CardEntry property={subtitle()}>
				{getValue()}
			</CardEntry>
		</>
	);
}
