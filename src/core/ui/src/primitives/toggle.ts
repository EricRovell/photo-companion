import { createSignal } from "solid-js";

export function createToggle(initialState = false) {
	const [ getToggled, setToggled ] = createSignal<boolean>(initialState);

	return [
		getToggled,
		(value?: boolean) => (typeof value === "boolean")
			? setToggled(value)
			: setToggled(state => !state)
	];
}
