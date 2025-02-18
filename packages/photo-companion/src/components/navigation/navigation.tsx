import { useBeforeLeave } from "@solidjs/router";
import { For } from "solid-js";
import { Button, Drawer } from "ui";
import { IconMenu } from "ui/icons";
import { createToggle } from "ui/primitives";
import { classnames } from "utils";

import { useNavigationService } from "~/services/navigation";
import { useTranslation } from "~/services/translation";

import { NavigationItem } from "./navigation.item";
import { NavigationMenu } from "./navigation.menu";

import styles from "./navigation.module.css";

function SideMenu() {
	const { t } = useTranslation();
	const [ getShowMenu, toggleShowMenu ] = createToggle(false);

	const handleOpen = () => toggleShowMenu(true);
	const handleClose = () => toggleShowMenu(false);

	useBeforeLeave(() => toggleShowMenu(false));

	return (
		<li class={classnames(styles["nav-item"], styles["nav-item-menu"])}>
			<Button appearance="ghost" class={classnames(styles.link, styles["nav-item-menu-button"])} onClick={handleOpen}>
				<IconMenu class={styles.icon} />
				<span>{t().LABEL.MENU}</span>
			</Button>
			<Drawer
				classes={{
					backdrop: styles.backdrop,
					dialog: styles.dialog,
					drawer: classnames(styles.drawer, "custom-scrollbar")
				}}
				onClose={handleClose}
				open={getShowMenu()}
			>
				<NavigationMenu onClose={handleClose} />
			</Drawer>
		</li>
	);
}

const SettingsLink = () => {
	const { NAVIGATION_TAB_DATA } = useNavigationService();

	return (
		<li class={classnames(styles["nav-item"], styles["nav-item-settings"])}>
			<NavigationItem
				classes={{
					icon: styles.icon,
					link: styles.link
				}}
				{...NAVIGATION_TAB_DATA.SETTINGS}
			/>
		</li>
	);
};

/**
 * Wide screens: all non-disabled primary sections are shown, `settings` and `menu` are on the right edge;
 * Smaller screens, not mobile yet: primary sections that not fit are hidden;
 * Smaller screens, possibly mobile: show only at max 4 sections, `settings` are hidden and `menu` is shown always;
 */
export function Navigation() {
	const { getNavigationTabs } = useNavigationService();

	return (
		<nav
			class={styles.navigation}
			style={{ "--navigation-items-count": getNavigationTabs().slice(0, 4).length + 1 }}
		>
			<ul class={styles["nav-items"]}>
				<For each={getNavigationTabs()}>
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
				<SettingsLink />
				<SideMenu />
			</ul>
		</nav>
	);
}
