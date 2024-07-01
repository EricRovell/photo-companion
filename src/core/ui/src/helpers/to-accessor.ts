import { type Accessor, createSignal } from "solid-js";
import { isNullable } from "utils/validators";

import { isAccessor } from "./is-accessor";

/**
 * Normalizes a value into Accessor.
 */
export function toAccessor<T>(input: Accessor<Nullable<T>> | Nullable<T>): Accessor<Nullable<T>> {
	if (isNullable(input) || !isAccessor(input)) {
		const [ getter ] = createSignal(input);
		return getter;
	}

	return input;
}
