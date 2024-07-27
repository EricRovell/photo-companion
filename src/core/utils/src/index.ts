import { isNonEmptyString, isNullable } from "./validators";

export function padWithZero(number: number): string {
	return number < 10 ? `0${number}` : number.toString();
}

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Same as `Object.entries()` but with type inference
 */
export function objectEntries<T extends object>(obj: T): Entries<T> {
	return Object.entries(obj) as Entries<T>;
}

type InputClassnamesPrimitive =
	| boolean
	| null
	| string
	| undefined;

type InputClassnames =
	| InputClassnamesPrimitive
	| InputClassnamesPrimitive[]
	| Record<string, InputClassnamesPrimitive>;

/**
 * Utility for constructing `class | className` strings.
 * 
 * Note: Takes as an input shallow arrays and objects. All falsy values are discarded.
 */
export function classnames(...args: InputClassnames[]): string {
	const classList: string[] = [];

	for (const arg of args) {
		if (typeof arg === "boolean" || !arg) {
			continue;
		}

		if (isNonEmptyString(arg)) {
			classList.push(arg);
			continue;
		}

		if (Array.isArray(arg)) {
			for (const item of arg) {
				if (item && isNonEmptyString(item)) {
					classList.push(item);
				}
			}
		} else if (typeof arg === "object") {
			for (const [ key, value ] of objectEntries(arg)) {
				if (value) {
					classList.push(key);
				}
			}
		}
	}

	return classList.join(" ");
}

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

/**
 * Sets the boolean attribute depending on state.
 */
export function setAttribute(state = false, value = "") {
	return state ? value : undefined;
}
