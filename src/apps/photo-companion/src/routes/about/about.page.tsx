import { lazy, Match, Suspense, Switch } from "solid-js";
import { Loader } from "ui";

import { Markdown } from "@lib/components/markdown";
import { useTranslation } from "@lib/context/translation";

const PageAboutEn = lazy(() => import("./about.en.md"));
const PageAboutRu = lazy(() => import("./about.ru.md"));

export function PageAbout() {
	const { lang } = useTranslation();

	return (
		<Suspense fallback={<Loader style={{ "--loader-size": "2rem" }} />}>
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
		</Suspense>
	);
}

export default PageAbout;
