import { createContext, createEffect, Loading, untrack, useContext } from "solid-js";

import type { ParentProps } from "solid-js";

import { SettingsProvider, useSettings } from "~/features/settings";
import { TranslationProvider } from "~/features/translation";

import type { UserLang } from "~/features/settings/types";

const LanguageContext = createContext<{ language: UserLang }>({ language: "en" });

export function StoryLanguageProvider(props: ParentProps<{ language: UserLang }>) {
	createEffect(() => props.language, language => { document.documentElement.lang = language; });

	return (
		<LanguageContext value={props}>
			{props.children}
		</LanguageContext>
	);
}

export function StoryTranslationProvider(props: ParentProps) {
	const story = useContext(LanguageContext);
	const { setSettings, settings } = useSettings();

	createEffect(() => story.language, language => {
		if (untrack(() => settings.language) !== language) {
			setSettings((draft) => {
				draft.language = language;
			});
		}
	});

	return (
		<Loading>
			<TranslationProvider>{props.children}</TranslationProvider>
		</Loading>
	);
}

export function StoryTranslations(props: ParentProps) {
	return (
		<SettingsProvider>
			<StoryTranslationProvider>
				{props.children}
			</StoryTranslationProvider>
		</SettingsProvider>
	);
}
