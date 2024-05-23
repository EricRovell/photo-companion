import { Show } from "solid-js";

import { useTranslation } from "@lib/context";
import { Markdown } from "@lib/components/markdown";
import PageAboutEn from "./about.en.md";
import PageAboutRu from "./about.ru.md";

export function PageAbout() {
	const { lang } = useTranslation();

	return (
		<Markdown>
			<Show when={lang() === "en"} fallback={<PageAboutRu />}>
				<PageAboutEn />
			</Show>
		</Markdown>
	);
}
