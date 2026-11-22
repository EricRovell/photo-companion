import { render } from "@solidjs/testing-library";
import { flush, getOwner } from "solid-js";

import type { ParentComponent } from "solid-js";

/** The upstream rc.2 helper flushes inside a component, violating v2's write scope. */
export function renderHook<T>(hook: () => T, options: { wrapper?: ParentComponent } = {}) {
	let result!: T;
	let owner: ReturnType<typeof getOwner> = null;

	const view = render(() => {
		result = hook();
		owner = getOwner();
		return null;
	}, options);

	flush();

	return {
		cleanup: view.unmount,
		get owner() { return owner; },
		result
	};
}
