import { getNavigationState } from "bridge-schedule";
import { IconAnchor } from "ui-solid";
import { classnames } from "utils";

import { useTranslation } from "@lib/context";
import { setAttribute } from "@lib/helpers";

import styles from "./navigation-event.module.css";

export function NavigationEvent() {
	const { t, formatters } = useTranslation();
	const { navigation, days} = getNavigationState(new Date());

	return (
		<article
			class={classnames("card", styles["navigation-info"])}
			data-closed={setAttribute(navigation)}
		>
			<header>
				{
					navigation
						? t().TITLE.NAVIGATION_OPENED
						: t().TITLE.NAVIGATION_CLOSED
				}
			</header>
			<p>{t().MESSAGE.NAVIGATION_IN}</p>
			<p>
				<output>
					{formatters().formatDays(days)}
				</output>
			</p>
			<IconAnchor />
		</article>
	);
}
