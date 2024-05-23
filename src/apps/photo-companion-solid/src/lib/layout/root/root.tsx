import { type ParentProps, onMount } from "solid-js";
import { useMatch, useSearchParams } from "@solidjs/router";
import { Link, Icon } from "ui-solid";
import { iconGithub, iconQuestion, iconSettings } from "ui-solid/icons";

import { title, version } from "@lib/constants";
import { Navigation } from "@lib/components/navigation/navigation";
import { ROUTE_ABOUT, ROUTE_CHANGELOG, ROUTE_SETTINGS, URL_GITHUB_REPO } from "@lib/consts";
import { useTranslation } from "@lib/context";
import { scrollToTop } from "@lib/helpers";
import { useLocation } from "@lib/hooks";

import styles from "./root.module.css";

/**
 * TODO: links should have some visual indicator.
 */
function SecondaryNavigation() {
	const { t } = useTranslation();
	const matchSettings = useMatch(() => ROUTE_SETTINGS);
	const matchAbout = useMatch(() => ROUTE_ABOUT);

	return (
		<nav>
			<Link
				aria-current={matchSettings() ? "page" : undefined}
				class={styles.icon}
				href={ROUTE_SETTINGS}
				onClick={scrollToTop}
				title={t().TITLE.SETTINGS}
			>
				<Icon path={iconSettings} viewBox="0 0 256 256" />
			</Link>
			<Link
				aria-current={matchAbout() ? "page" : undefined}
				class={styles.icon}
				href={ROUTE_ABOUT}
				onClick={scrollToTop}
				title={t().TITLE.ABOUT}
			>
				<Icon path={iconQuestion} viewBox="0 0 256 256" />
			</Link>
		</nav>
	);
}

const Header = () => (
	<header class={styles.header}>
		<div class={styles.content}>
			<Link href="{getTabUrl($navigationStore[0])}{$query}">
				<h1>{title}</h1>
			</Link>
			<SecondaryNavigation />
		</div>
	</header>
);

const Footer = () => (
	<footer class={styles.footer}>
		<div class={styles.content}>
			<p>
				{title}, <Link href={ROUTE_CHANGELOG}>v.{version}</Link> 
				<Link href="https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__">#__COMMIT_HASH__</Link>
			</p>
			<Link href={URL_GITHUB_REPO}>
				<Icon path={iconGithub} viewBox="0 0 36 36" />
				<span>Github</span>
			</Link>
		</div>
	</footer>
);

export const Root = (props: ParentProps) => {
	const setQuery = useSearchParams()[1];
	const { getLatitude, getLongitude } = useLocation();

	onMount(() => {
		setQuery({
			latitude: getLatitude(),
			longitude: getLongitude()
		});
	});

	return (
		<>
			<Header />
			<Navigation />
			<main>
				{props.children}
			</main>
			<Footer />
		</>
	);
};
