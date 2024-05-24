import { For } from "solid-js";

import { useTranslation } from "@lib/context";
import { getTabData, useNavigationTabs } from "./navigation.helpers";
import type { NavigationRoute } from "./navigation.types";

import styles from "./navigation.module.css";
import { useMatch } from "@solidjs/router";
import { Dynamic } from "solid-js/web";
import { LinkQuery } from "../link-query";

function NavigationItem(props: NavigationRoute) {
	const match = useMatch(() => props.href);
	const { t } = useTranslation();

	return (
		<li>
			<LinkQuery
				aria-current={match() ? "page" : undefined}
				class={styles.link}
				href={props.href}
			>
				<Dynamic component={props.Icon} class={styles.icon} />
				<span>{t().TITLE[props.label]}</span>
			</LinkQuery>
		</li>
	);
}

export const Navigation = () => (
	<nav
		class={styles.navigation}
		style={{ "--navigation-items-count": useNavigationTabs().length }}
	>
		<ul class={styles["nav-items"]}>
			<For each={useNavigationTabs()}>
				{item => <NavigationItem {...getTabData(item)} />}
			</For>
		</ul>
	</nav>
);
