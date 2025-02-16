import type {  NavigationState as NavigationStateType } from "bridge-schedule";

import { CardEntry } from "~/components";
import { useTranslation } from "~/services/translation";

/**
 * Renders navigation period related card entries.
 */
export function NavigationState(props: NavigationStateType) {
	const { format, t } = useTranslation();

	const getNavigationLabel = () => props.navigation
		? t().LABEL.NAVIGATION_OPENED_SHORT
		: t().LABEL.NAVIGATION_CLOSED_SHORT;

	const subtitle = () => props.navigation
		? t().MESSAGE.NAVIGATION_ENDS_AT
		: t().MESSAGE.NAVIGATION_STARTS_AT;

	return (
		<>
			<CardEntry property={t().LABEL.NAVIGATION}>
				<span data-text={props.navigation ? "success" : "danger"}>
					{getNavigationLabel()}
				</span>
			</CardEntry>
			<CardEntry property={subtitle()}>
				{format().days(props.days)}
			</CardEntry>
		</>
	);
}
