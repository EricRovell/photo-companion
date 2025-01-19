import { For } from "solid-js";
import { Button, IconClose, Link } from "ui";

import { ROUTE_CHANGELOG, VERSION } from "@lib/consts";
import { useTranslation } from "@lib/context/translation";
import { useSupportsBridges, useSupportsLights } from "@lib/hooks";

import { NAVIGATION_TAB_DATA } from "./navigation.const";
import { NavigationItem } from "./navigation.item";

import styles from "./navigation.menu.module.css";

const classes = {
	link: styles.link
};

interface Props {
	onClose: VoidFunction;
}

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

export function NavigationMenu(props: Props) {
	const { t } = useTranslation();
	const groups = useNavItemGroups();

	return (
		<>
			<header class={styles.header}>
				<h2>{t().LABEL.MENU}</h2>
				<Button icon onClick={props.onClose} type="button">
					<IconClose />
				</Button>
			</header>
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
			</nav>
			<footer class={styles.footer}>
				<dl class={styles.info}>
					<div>
						<dt>Version:</dt>
						<dd>
							<Link href={ROUTE_CHANGELOG}>
								v.{VERSION}
							</Link>
						</dd>
					</div>
					<div>
						<dt>Commit:</dt>
						<dd>
							<Link href="https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__">
								#__COMMIT_HASH__
							</Link>
						</dd>
					</div>
				</dl>
			</footer>
		</>
	);
}
