import { useContext } from "solid-js";
import { isNullable } from "utils/validators";

import type { Context, ParentProps} from "solid-js";

interface Options<T> {
	consumerName?: `use${Capitalize<string>}`;
	Context: Context<T>;
	getValue: () => T;
	providerName?: string;
}

export function createProvider<T>(options: Options<T>) {
	const { consumerName = "useContext", Context, getValue, providerName = "Context" } = options;

	function Provider(props: ParentProps) {
		return (
			<Context.Provider value={getValue()}>
				{props.children}
			</Context.Provider>
		);
	}

	function useProvider() {
		const value = useContext(Context);

		if (isNullable(value)) {
			throw new Error(`${consumerName} must be used with a ${providerName}.Provider`);
		}

		return value as NonNullable<T>;
	}

	return [ Provider, useProvider ] as const;
}
