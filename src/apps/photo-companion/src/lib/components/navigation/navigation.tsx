import { useBeforeLeave } from "@solidjs/router";
import { For } from "solid-js";
import { Button, Drawer, IconMenu } from "ui";
import { createToggle } from "ui/primitives";

import { useTranslation } from "@lib/context";
import { useNavigationTabs } from "@lib/hooks";

import { NavigationItem } from "./navigation.item";
import { NavigationMenu } from "./navigation.menu";

import styles from "./navigation.module.css";

export function Navigation() {
	const { t } = useTranslation();
	const { getTabLinks } = useNavigationTabs();
	const [ getShowMenu, toggleShowMenu ] = createToggle(false);

	useBeforeLeave(() => toggleShowMenu(false));

	return (
		<nav
			class={styles.navigation}
			style={{ "--navigation-items-count": getTabLinks().length + 1 }}
		>
			<ul class={styles["nav-items"]}>
				<For each={getTabLinks()}>
					{item => (
						<li class={styles["nav-item"]}>
							<NavigationItem
								classes={{
									icon: styles.icon,
									link: styles.link
								}}
								{...item}
							/>
						</li>
					)}
				</For>
				<li class={styles["nav-item"]}>
					<Button appearance="ghost" class={styles.link} onClick={() => toggleShowMenu(true)}>
						<IconMenu class={styles.icon} />
						<span>{t().LABEL.MENU}</span>
					</Button>
				</li>
			</ul>
			<Drawer
				classes={{
					backdrop: styles.backdrop,
					dialog: styles.dialog,
					drawer: styles.drawer
				}}
				onClose={() => toggleShowMenu(false)}
				open={getShowMenu()}
			>
				<NavigationMenu />
			</Drawer>
		</nav>
	);
}
