import { createSignal, type ParentProps } from "solid-js";

import { useSwipe } from "~/shared/primitives";

import { useNavigationService } from "../model";

function shouldIgnoreSwipe(event: TouchEvent): boolean {
	return event.composedPath().some(target => (
		target instanceof HTMLElement && target.dataset.pageSwipe === "ignore"
	));
}

export function LayoutSwipe(props: ParentProps) {
	const [ getRef, setRef ] = createSignal<HTMLDivElement | null>(null);
	const { createSwiper } = useNavigationService();

	const swipe = createSwiper();

	useSwipe(getRef, {
		onSwipeEnd(event, direction) {
			if (shouldIgnoreSwipe(event)) {
				return;
			}

			if (direction === "LEFT") {
				swipe(1);
			} else if (direction === "RIGHT") {
				swipe(-1);
			}
		}
	});

	return (
		<div ref={setRef} style={{ display: "contents" }}>
			{props.children}
		</div>
	);
}
