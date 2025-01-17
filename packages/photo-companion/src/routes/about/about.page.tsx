import { lazy, Match, Switch } from "solid-js";

import { Markdown } from "@lib/components/markdown";
import { useTranslation } from "@lib/context/translation";

const PageAboutEn = lazy(() => import("./about.en.md"));
const PageAboutRu = lazy(() => import("./about.ru.md"));

export function PageAbout() {
	const { lang } = useTranslation();

	return (
		<Markdown>
			<Switch>
				<Match when={lang() === "en"}>
					<PageAboutEn />
				</Match>
				<Match when={lang() === "ru"}>
					<PageAboutRu />
				</Match>
			</Switch>
		</Markdown>
	);
}

export default PageAbout;
