import { createSignal, type ParentProps } from "solid-js";
import { useSwipe } from "ui/primitives";

import { useNavigationService } from "~/services/navigation";

export function WithSwipe(props: ParentProps) {
	const [ getRef, setRef ] = createSignal<HTMLDivElement | null>(null);
	const { createSwiper } = useNavigationService();

	const swipe = createSwiper();

	useSwipe(getRef, {
		onSwipeEnd(_, direction) {
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
