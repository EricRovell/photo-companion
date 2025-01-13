import { getOwner, onCleanup } from "solid-js";

/**
 * Calls `onCleanup()` if it is inside a component lifecycle, if not, do nothing.
 */
export function tryOnCleanup(func: VoidFn) {
	if (getOwner()) {
		onCleanup(func);
		return true;
	}

	return false;
}
