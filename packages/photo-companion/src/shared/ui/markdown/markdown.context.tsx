import { createContext, createSignal, type ParentProps, useContext } from "solid-js";

import type { DefinitionProps} from "./markdown.types";

type DefinitionContextValue = Record<string, Pick<DefinitionProps, "label" | "title" | "url">>;

function makeDefinitionContext() {
	const [ getDefinitions, setDefinitions ] = createSignal<DefinitionContextValue>({});

	return {
		getDefinitions,
		setDefinitions
	} as const;
}

const DefinitionContext = createContext<null | ReturnType<typeof makeDefinitionContext>>(null);

export function DefinitionProvider(props: ParentProps) {
	const value = makeDefinitionContext();

	return (
		<DefinitionContext value={value}>
			{props.children}
		</DefinitionContext>
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
