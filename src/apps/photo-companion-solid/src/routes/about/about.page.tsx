import { Show } from "solid-js";

import { Markdown } from "@lib/components/markdown";
import { useTranslation } from "@lib/context";

import PageAboutEn from "./about.en.md";
import PageAboutRu from "./about.ru.md";

export function PageAbout() {
	const { lang } = useTranslation();

	return (
		<Markdown>
			<Show fallback={<PageAboutRu />} when={lang() === "en"}>
				<PageAboutEn />
			</Show>
		</Markdown>
	);
}
