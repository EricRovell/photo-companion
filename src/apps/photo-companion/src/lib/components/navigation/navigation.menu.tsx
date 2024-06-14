import { NAVIGATION_TAB_DATA } from "./navigation.const";
import { NavigationItem } from "./navigation.item";

import styles from "./navigation.menu.module.css";

export function NavigationMenu() {
	const classes = {
		link: styles.link
	};

	return (
		<nav class={styles.menu}>
			<section>
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.TIMELINE} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.LIGHTS} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.SUN} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.MOON} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.BRIDGES} />
				<hr />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.SETTINGS} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.ABOUT} />
				<NavigationItem classes={classes} {...NAVIGATION_TAB_DATA.CHANGELOG} />
			</section>
		</nav>
	);
}
