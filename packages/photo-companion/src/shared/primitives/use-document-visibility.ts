import { createSignal } from "solid-js";

import { createEventListener } from "./create-event-listener";

export function useDocumentVisibility() {
	const [ getVisible, setVisible ] = createSignal<boolean>(document.visibilityState === "visible");

	createEventListener({
		event: "visibilitychange",
		listener: () => setVisible(document.visibilityState === "visible"),
		target: document
	});

	return getVisible;
}
