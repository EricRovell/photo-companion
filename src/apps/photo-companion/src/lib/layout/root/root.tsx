import { useSearchParams } from "@solidjs/router";
import { createEffect, type ParentProps } from "solid-js";
import { IconGithub, Link } from "ui";
import { isNullable } from "utils/validators";

import { Bulb, LinkQuery, Navigation } from "@lib/components";
import { TITLE, VERSION } from "@lib/consts";
import { ROUTE_CHANGELOG, URL_GITHUB_REPO } from "@lib/consts";
import { useSettings } from "@lib/context/settings";
import { useLocation } from "@lib/hooks";

import styles from "./root.module.css";

function Header() {
	const { getSettings } = useSettings();
	const mainTab = getSettings().tabs[0];

	return (
		<header class={styles.header}>
			<div class={styles.content}>
				<LinkQuery class={styles["title-link"]} href={`/${mainTab.toLowerCase()}`}>
					<h1 class={styles.title}>
						<Bulb class={styles["title-icon"]} hoverGlow />
						{TITLE}
					</h1>
				</LinkQuery>
			</div>
		</header>
	);
}

const Footer = () => (
	<footer class={styles.footer}>
		<div class={styles.content}>
			<p>
				{TITLE}, <Link href={ROUTE_CHANGELOG}>v.{VERSION}</Link> 
				<Link href="https://github.com/ericrovell/photo-companion/commit/__COMMIT_HASH__">#__COMMIT_HASH__</Link>
			</p>
			<Link href={URL_GITHUB_REPO}>
				<IconGithub />
				<span>Github</span>
			</Link>
		</div>
	</footer>
);

export const Root = (props: ParentProps) => {
	const [ searchParams, setSearchParams ] = useSearchParams();
	const { getLatitude, getLongitude } = useLocation();

	createEffect(() => {
		if (isNullable(searchParams.latitude) || isNullable(searchParams.longitude)) {
			setSearchParams({
				latitude: getLatitude(),
				longitude: getLongitude()
			});
		}
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
