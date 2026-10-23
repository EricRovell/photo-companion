import { createContext, createEffect, Suspense, useContext } from "solid-js";

import type { ParentProps } from "solid-js";

import { SettingsProvider, useSettings } from "~/features/settings";
import { TranslationProvider } from "~/features/translation";

import type { UserLang } from "~/features/settings/types";

const LanguageContext = createContext<{ language: UserLang }>({ language: "en" });

export function StoryLanguageProvider(props: ParentProps<{ language: UserLang }>) {
	createEffect(() => { document.documentElement.lang = props.language; });

	return (
		<LanguageContext.Provider value={props}>
			{props.children}
		</LanguageContext.Provider>
	);
}

export function StoryTranslationProvider(props: ParentProps) {
	const story = useContext(LanguageContext);
	const { setSettings, settings } = useSettings();

	createEffect(() => {
		if (settings.language !== story.language) {
			setSettings("language", story.language);
		}
	});

	return (
		<Suspense>
			<TranslationProvider>{props.children}</TranslationProvider>
		</Suspense>
	);
}

export function StoryTranslations(props: ParentProps) {
	return (
		<SettingsProvider>
			<StoryTranslationProvider>{props.children}</StoryTranslationProvider>
		</SettingsProvider>
	);
}
