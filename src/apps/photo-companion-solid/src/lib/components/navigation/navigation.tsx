import { For } from "solid-js";
import { Icon, Link } from "ui-solid";

import { navigation, getTabData, type NavigationRoute } from "@lib/stores/navigation";
import { scrollToTop } from "@lib/helpers";
import { t } from "@stores/lang";

import styles from "./navigation.module.css";
import { useMatch } from "@solidjs/router";

function NavigationItem(props: NavigationRoute) {
	const match = useMatch(() => props.href);

	return (
		<li>
			<Link
				aria-current={match() ? "page" : undefined}
				class={styles.link}
				href={props.href}
				onClick={scrollToTop}
			>
				<Icon
					class={styles.icon}
					path={props.icon}
					viewBox="0 0 256 256"
				/>
				<span>{t().TITLE[props.label]}</span>
			</Link>
		</li>
	);
}

export const Navigation = () => (
	<nav
		class={styles.navigation}
		style={{
			"--navigation-items-count": navigation().length
		}}
	>
		<ul class={styles["nav-items"]}>
			<For each={navigation()}>
				{item => <NavigationItem {...getTabData(item)} />}
			</For>
		</ul>
	</nav>
);
