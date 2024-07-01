import { Show } from "solid-js";

import { Markdown } from "@lib/components/markdown";
import { useTranslation } from "@lib/context";

import PageChangelogEn from "./changelog.en.md";
import PageChangelogRu from "./changelog.ru.md";

export function PageChangelog() {
	const { lang } = useTranslation();

	return (
		<Markdown>
			<Show fallback={<PageChangelogRu />} when={lang() === "en"}>
				<PageChangelogEn />
			</Show>
		</Markdown>
	);
}
