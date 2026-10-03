import type { NavigationState as NavigationStateType } from "bridge-schedule";

import { useTranslation } from "~/features/translation";
import { PropertyList, Text } from "~/shared/ui";

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
			<PropertyList.Item>
				<PropertyList.Label>
					{t().LABEL.NAVIGATION}
				</PropertyList.Label>
				<PropertyList.Value>
					<Text color={props.navigation ? "success" : "danger"} variant="text-s">
						{getNavigationLabel()}
					</Text>
				</PropertyList.Value>
			</PropertyList.Item>
			<PropertyList.Item>
				<PropertyList.Label>
					{subtitle()}
				</PropertyList.Label>
				<PropertyList.Value>
					{format().days(props.days)}
				</PropertyList.Value>
			</PropertyList.Item>
		</>
	);
}
