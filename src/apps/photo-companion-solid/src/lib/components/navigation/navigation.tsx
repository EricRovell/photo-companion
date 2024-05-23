import { For } from "solid-js";
import { Icon, Link } from "ui-solid";

import { useTranslation } from "@lib/context";
import { getTabData, useNavigationTabs } from "./navigation.helpers";
import type { NavigationRoute } from "./navigation.types";

import styles from "./navigation.module.css";
import { useMatch } from "@solidjs/router";
import { Dynamic } from "solid-js/web";

function NavigationItem(props: NavigationRoute) {
	const match = useMatch(() => props.href);
	const { t } = useTranslation();

	return (
		<li>
			<Link
				aria-current={match() ? "page" : undefined}
				class={styles.link}
				href={props.href}
			>
				<Dynamic component={props.Icon} class={styles.icon} />
				<span>{t().TITLE[props.label]}</span>
			</Link>
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
