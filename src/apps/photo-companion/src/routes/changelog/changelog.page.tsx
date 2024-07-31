import { lazy, Match, Suspense, Switch } from "solid-js";
import { Loader } from "ui";

import { Markdown } from "@lib/components/markdown";
import { useTranslation } from "@lib/context/translation";

const PageChangelogEn = lazy(() => import("./changelog.en.md"));
const PageChangelogRu = lazy(() => import("./changelog.ru.md"));

export function PageChangelog() {
	const { lang } = useTranslation();

	return (
		<Suspense fallback={<Loader style={{ "--loader-size": "2rem" }} />}>
			<Markdown>
				<Switch>
					<Match when={lang() === "en"}>
						<PageChangelogEn />
					</Match>
					<Match when={lang() === "ru"}>
						<PageChangelogRu />
					</Match>
				</Switch>
			</Markdown>
		</Suspense>
	);
}

export default PageChangelog;
