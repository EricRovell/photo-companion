import { useMatch } from "@solidjs/router";
import { For } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useTranslation } from "@lib/context";
import { useNavigationTabs } from "@lib/hooks";

import { LinkQuery } from "../link-query";

import type { NavigationRoute } from "./navigation.types";

import styles from "./navigation.module.css";

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
				<Dynamic class={styles.icon} component={props.Icon} />
				<span>{t().TITLE[props.label]}</span>
			</LinkQuery>
		</li>
	);
}

export function Navigation() {
	const { getTabLinks } = useNavigationTabs();

	return (
		<nav
			class={styles.navigation}
			style={{ "--navigation-items-count": getTabLinks().length }}
		>
			<ul class={styles["nav-items"]}>
				<For each={getTabLinks()}>
					{item => <NavigationItem {...item} />}
				</For>
			</ul>
		</nav>
	);
}
