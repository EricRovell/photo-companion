import type { ParentProps } from "solid-js";

import { NAVIGATION_TAB_DATA } from "./navigation.const";
import { NavigationItem } from "./navigation.item";

import styles from "./navigation.menu.module.css";

const classes = {
	link: styles.link
};

export function NavigationMenu(props: ParentProps) {
	

	return (
		<nav class={styles.menu}>
			<section class={styles.section}>
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.TIMELINE} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.LIGHTS} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.SUN} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.MOON} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.BRIDGES} />
			</section>
			<section class={styles.section}>
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.SETTINGS} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.ABOUT} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.CHANGELOG} />
			</section>
			<form class={styles.form}>
				{props.children}
			</form>
		</nav>
	);
}
