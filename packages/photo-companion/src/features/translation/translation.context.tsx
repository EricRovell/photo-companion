import { createContext, type ParentProps, Show, useContext } from "solid-js";
import { isNullable } from "utils/validators";

import type { Accessor} from "solid-js";

import { createTranslationState } from "./translation.state";

import type { t as tEn } from "./translation.en";
import type { t as tRu } from "./translation.ru";

interface TranslationContextType extends Omit<ReturnType<typeof createTranslationState>, "t"> {
	t: Accessor<typeof tEn | typeof tRu>;
}

const TranslationContext = createContext<TranslationContextType>();

export function TranslationProvider(props: ParentProps) {
	const { t, ...rest } = createTranslationState();

	return (
		<Show when={t()}>
			{(t) => (
				<TranslationContext.Provider value={{ t, ...rest }}>
					{props.children}
				</TranslationContext.Provider>
			)}
		</Show>
	);
}

export function useTranslation() {
	const value = useContext(TranslationContext);

	if (isNullable(value)) {
		throw new Error("useTranslation must be used within a TranslationContext.Provider");
	}

	return value;
}
