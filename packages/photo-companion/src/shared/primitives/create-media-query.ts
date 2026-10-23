import { createSignal, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

import type { Accessor } from "solid-js";

export function createMediaQuery(query: string, fallback = false): Accessor<boolean> {
	if (isServer || typeof window.matchMedia !== "function") {
		return () => fallback;
	}

	const media = window.matchMedia(query);
	const [ matches, setMatches ] = createSignal(media.matches);
	const update = () => setMatches(media.matches);

	media.addEventListener("change", update);

	onCleanup(() => media.removeEventListener("change", update));

	return matches;
}
