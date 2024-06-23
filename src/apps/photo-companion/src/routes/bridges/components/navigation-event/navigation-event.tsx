import { getNavigationState } from "bridge-schedule";
import { IconAnchor } from "ui";
import { classnames } from "utils";

import { useTranslation } from "@lib/context";
import { setAttribute } from "@lib/helpers";

import styles from "./navigation-event.module.css";

export function NavigationEvent() {
	const { formatters, t } = useTranslation();
	const { days, navigation} = getNavigationState();

	const title = () => navigation
		? t().TITLE.NAVIGATION_OPENED
		: t().TITLE.NAVIGATION_CLOSED;

	const subtitle = () => navigation
		? t().MESSAGE.NAVIGATION_ENDS_AT
		: t().MESSAGE.NAVIGATION_STARTS_AT;

	return (
		<article
			class={classnames("card", styles["navigation-info"])}
			data-closed={setAttribute(!navigation)}
		>
			<header>
				{title()}
			</header>
			<p>{subtitle()}</p>
			<p>
				<output>
					{formatters().formatDays(days)}
				</output>
			</p>
			<IconAnchor />
		</article>
	);
}
