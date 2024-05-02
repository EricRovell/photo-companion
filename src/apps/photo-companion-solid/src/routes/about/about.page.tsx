import { Show } from "solid-js";

import { Markdown } from "@lib/components/markdown";
import { lang } from "@lib/stores/lang";
import PageAboutEn from "./about.en.md";
import PageAboutRu from "./about.ru.md";

export const PageAbout = () => (
	<Markdown>
		<Show when={lang() === "en"} fallback={<PageAboutRu />}>
			<PageAboutEn />
		</Show>
	</Markdown>
);
