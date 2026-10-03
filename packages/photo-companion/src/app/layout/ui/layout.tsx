import { type ParentProps } from "solid-js";

import { PageMeta } from "~/entities/page-meta";
import { Bulb } from "~/features/city-lights";
import { LinkQuery, Navigation } from "~/features/navigation";
import { useSettings } from "~/features/settings";
import { TITLE } from "~/shared/consts";
import { Text } from "~/shared/ui";

import { useLocationQuery } from "../model";

import styles from "./layout.module.css";

function Header() {
	const { settings } = useSettings();
	const getMainTabHref = () => `/${settings.tabs[0].toLowerCase()}`;

	return (
		<header class={styles.header}>
			<div class={styles.content}>
				<LinkQuery class={styles["title-link"]} href={getMainTabHref()}>
					<Text as="h1" class={styles.title} variant="text-l">
						<Bulb class={styles["title-icon"]} hoverGlow />
						{TITLE}
					</Text>
				</LinkQuery>
			</div>
		</header>
	);
}

export const Layout = (props: ParentProps) => {
	useLocationQuery();

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
