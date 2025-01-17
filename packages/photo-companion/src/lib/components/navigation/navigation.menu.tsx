import { For, type ParentProps } from "solid-js";

import { useSupportsBridges, useSupportsLights } from "@lib/hooks";

import { NAVIGATION_TAB_DATA } from "./navigation.const";
import { NavigationItem } from "./navigation.item";

import styles from "./navigation.menu.module.css";

const classes = {
	link: styles.link
};

function useNavItemGroups() {
	const supportsLights = useSupportsLights();
	const supportsBridges = useSupportsBridges();

	return () => ([
		[
			NAVIGATION_TAB_DATA.NOW,
			NAVIGATION_TAB_DATA.TIMELINE,
			...(supportsLights() ? [ NAVIGATION_TAB_DATA.LIGHTS ] : []),
			NAVIGATION_TAB_DATA.SUN,
			NAVIGATION_TAB_DATA.MOON,
			...(supportsBridges() ? [ NAVIGATION_TAB_DATA.BRIDGES ] : [])
		],
		[
			NAVIGATION_TAB_DATA.SETTINGS,
			NAVIGATION_TAB_DATA.ABOUT,
			NAVIGATION_TAB_DATA.CHANGELOG
		]
	]);
}

export function NavigationMenu(props: ParentProps) {
	const groups = useNavItemGroups();

	return (
		<nav class={styles.menu}>
			<For each={groups()}>
				{group => (
					<section class={styles.section}>
						<For each={group}>
							{item => (
								<NavigationItem classes={classes} {...item} />
							)}
						</For>
					</section>
				)}
			</For>
			<form class={styles.form}>
				{props.children}
			</form>
		</nav>
	);
}
