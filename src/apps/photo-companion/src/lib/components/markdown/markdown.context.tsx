import { createContext, createSignal, type ParentProps, useContext } from "solid-js";

import type { DefinitionProps} from "./markdown.types";

export type DefinitionContextValue = Record<string, Pick<DefinitionProps, "label" | "title" | "url">>;

export function makeDefinitionContext () {
	const [ getDefinitions, setDefinitions ] = createSignal<DefinitionContextValue>({});

	return {
		getDefinitions,
		setDefinitions
	} as const;
}

const DefinitionContext = createContext<ReturnType<typeof makeDefinitionContext>>();

export function DefinitionProvider(props: ParentProps) {
	const value = makeDefinitionContext();

	return (
		<DefinitionContext.Provider value={value}>
			{props.children}
		</DefinitionContext.Provider>
	);
}

export function useDefinition() {
	const value = useContext(DefinitionContext);

	if (!value) {
		throw new Error(
			"useCountNameContext should be called inside its ContextProvider"
		);
	}

	return value;
}
