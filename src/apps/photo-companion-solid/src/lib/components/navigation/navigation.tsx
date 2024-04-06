import { Icon, Link } from "ui-solid";

import { navigation, getTabData } from "@lib/stores/navigation";
import { scrollToTop } from "@lib/helpers";
import { NavigationRoute } from "@lib/stores/navigation/navigation.types";
import { t } from "@stores/lang";
import { For } from "solid-js";

import styles from "./navigation.module.css";

function NavigationItem(props: NavigationRoute) {

	return (
		<li>
			<Link
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

export function Navigation() {

	return (
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
}
