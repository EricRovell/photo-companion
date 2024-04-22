import { getNavigationState } from "bridge-schedule";
import { Icon } from "ui-solid";
import { iconAnchor } from "ui-solid/icons";
import { classnames } from "utils";

import { formatDays, t } from "@stores/lang";
import styles from "./bridges.module.css";

export function BridgesNavigationEvent() {
	const { navigation, days} = getNavigationState(new Date());

	return (
		<article
			class={classnames("card", styles["navigation-info"])}
			data-closed={navigation ? undefined : ""}
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
					{formatDays(days)}
				</output>
			</p>
			<Icon path={iconAnchor} />
		</article>
	);
}
