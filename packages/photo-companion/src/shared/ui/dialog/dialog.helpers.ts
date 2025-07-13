import { isNullable } from "utils/validators";

/**
 * Prevents the page scroll depending on condition.
 */
export function preventPageScroll(condition = false) {
	if (isNullable(globalThis.window)) {
		return;
	}

	const element = document.body;
	const isLocked = element.hasAttribute("data-locked");

	if (isLocked && condition) {
		return;
	}

	if (!isLocked && condition) {
		element.setAttribute("data-locked", "");

		// prevent page scroll, mostly for safari hack
		element.style.cssText = `
			top: -${window.scrollY}px;
			position: fixed;
			overflow-y: scroll;
			overscroll-behavior: none;
		`;

		return;
	}

	const offset = -1 * parseInt(element.style.top || "0");
	element.style.cssText = "";
	element.removeAttribute("data-locked");

	window.scrollTo({
		behavior: "instant",
		top: offset
	});
}
