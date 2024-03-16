import { tick } from "svelte";

const callbacks: Array<(...args: unknown[]) => void> = [];
let inProgress = false;

function clearCallbacks() {
	while (callbacks.length > 0) {
		const cb = callbacks.pop();
		
		if (cb) {
			cb();
		}
	}
}

export function pageTransition<Callback extends () => void>(callback: Callback, classNames: string[] = [], shouldTransition = true) {
	// allows for easily toggling off the transition for certain state changes
	if (!shouldTransition) {
		callback();
		return;
	}

	callbacks.push(callback);

	if (inProgress) {
		return;
	}

	inProgress = true;

	const t = transitionHelper({
		classNames,
		updateDOM: async () => {
			clearCallbacks();
			await tick();
			// some callbacks may be queued in the middle of the transition, resolve those too
			clearCallbacks(); 
		}
	});

	t.finished.finally(() => {
		clearCallbacks();
		inProgress = false;
	});
}

interface TransitionHelperArgs {
	skipTransition?: boolean;
	classNames?: string[];
	updateDOM: () => Promise<void>;
}

// copied from Jake Archibald's explainer
// https://developer.chrome.com/docs/web-platform/view-transitions/#not-a-polyfill
function transitionHelper({ skipTransition = false, classNames = [], updateDOM }: TransitionHelperArgs) {
	// @ts-expect-error: new feature
	if (skipTransition || !document.startViewTransition) {
		const updateCallbackDone = Promise.resolve(updateDOM()).then(() => {});

		return {
			ready: Promise.reject(Error("View transitions unsupported")),
			updateCallbackDone,
			finished: updateCallbackDone,
			skipTransition: () => {}
		};
	}

	document.documentElement.classList.add(...classNames);

	// @ts-expect-error: new feature
	const transition = document.startViewTransition(updateDOM);

	transition.finished.finally(() =>
		document.documentElement.classList.remove(...classNames)
	);

	return transition;
}
