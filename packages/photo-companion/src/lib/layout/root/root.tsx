import { useSearchParams } from "@solidjs/router";
import { createEffect, type ParentProps } from "solid-js";
import { isNullable } from "utils/validators";

import { Bulb, LinkQuery, Navigation, PageMeta } from "~/lib/components";
import { TITLE } from "~/lib/consts";
import { useSettings } from "~/lib/context/settings";

import styles from "./root.module.css";

function Header() {
	const { settings } = useSettings();
	const getMainTabHref = () => `/${settings.tabs[0].toLowerCase()}`;

	return (
		<header class={styles.header}>
			<div class={styles.content}>
				<LinkQuery class={styles["title-link"]} href={getMainTabHref()}>
					<h1 class={styles.title}>
						<Bulb class={styles["title-icon"]} hoverGlow />
						{TITLE}
					</h1>
				</LinkQuery>
			</div>
		</header>
	);
}

export const Root = (props: ParentProps) => {
	const [ searchParams, setSearchParams ] = useSearchParams();
	const { settings } = useSettings();

	createEffect(() => {
		if (isNullable(searchParams.latitude) || isNullable(searchParams.longitude)) {
			setSearchParams({
				latitude: settings.latitude,
				longitude: settings.longitude
			});
		}
	});

	return (
		<>
			<PageMeta />
			<Header />
			<Navigation />
			<main>
				{props.children}
			</main>
		</>
	);
};
