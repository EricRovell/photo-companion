import { type ParentProps, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Link, Icon } from "ui-solid";
import { iconGithub, iconQuestion, iconSettings } from "ui-solid/icons";

import { title, version } from "@lib/constants";
import { Navigation } from "@lib/components/navigation/navigation";
import { routeAbout, routeChangelog, routeSettings, urlGithub } from "@lib/routes";
import { t } from "@lib/stores/lang";
import { scrollToTop } from "@lib/helpers";
import { settings } from "@stores/settings";
import styles from "./root.module.css";

const Header = () => (
	<header class={styles.header}>
		<div class={styles.content}>
			<Link href="{getTabUrl($navigationStore[0])}{$query}">
				<h1>{title}</h1>
			</Link>
			<nav>
				<Link
					class={styles.icon}
					href={routeSettings}
					onClick={scrollToTop}
					title={t().TITLE.SETTINGS}
				>
					<Icon path={iconSettings} viewBox="0 0 256 256" />
				</Link>
				<Link
					class={styles.icon}
					href={routeAbout}
					onClick={scrollToTop}
					title={t().TITLE.ABOUT}
				>
					<Icon path={iconQuestion} viewBox="0 0 256 256" />
				</Link>
			</nav>
		</div>
	</header>
);

const Footer = () => (
	<footer class={styles.footer}>
		<div class={styles.content}>
			<p>
				{title}, <Link href={routeChangelog}>v.{version}</Link> 
				<Link href="https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__">#__COMMIT_HASH__</Link>
			</p>
			<Link href={urlGithub}>
				<Icon path={iconGithub} viewBox="0 0 36 36" />
				<span>Github</span>
			</Link>
		</div>
	</footer>
);

export const Root = (props: ParentProps) => {
	const setQuery = useSearchParams()[1];

	onMount(() => {
		const { latitude, longitude } = settings();

		setQuery({
			latitude,
			longitude
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
