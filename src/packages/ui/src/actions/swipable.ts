import type { ActionReturn } from "svelte/action";

type Direction = "up" | "right" | "down" | "left";
type EventName = `swipe-${Direction}`;

export interface SwipeEvent {
	direction: Direction;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

interface Options {
	threshold: number;
	timeout: number;
}

interface Attributes {
	"on:swipe"?: (e: CustomEvent<SwipeEvent>) => void;
	"on:swipe-left"?: (e: CustomEvent<SwipeEvent>) => void;
	"on:swipe-right"?: (e: CustomEvent<SwipeEvent>) => void;
	"on:swipe-up"?: (e: CustomEvent<SwipeEvent>) => void;
	"on:swipe-down"?: (e: CustomEvent<SwipeEvent>) => void;
}

type SwipableAction = (node: HTMLElement, options: Options) => ActionReturn<Options, Attributes>;

export interface Action<Parameter = void, Return = ActionReturn<Parameter>> {
	<Node extends HTMLElement>(node: Node, parameter?: Parameter): Return;
}

const DEFAULT_OPTIONS: Options = {
	threshold: 25,
	timeout: 750
};

/**
 * Creates panStart, panMove, panEnd events so you can drag elements.
 */
export const swipable: SwipableAction = (node, { threshold = 25, timeout = 750 } = DEFAULT_OPTIONS) => {
	let x: number = NaN;
	let y: number = NaN;
	let dx: number = NaN;
	let dy: number = NaN;
	let touchTime: number = NaN;

	function handleTouchstart(event: TouchEvent) {
		touchTime = Date.now();
		x = event.touches[0].clientX;
		y = event.touches[0].clientY;
		dx = 0;
		dy = 0;
	}

	function handleTouchmove(event: TouchEvent) {
		if (!x || !y) {
			return;
		}

		dx = x - event.touches[0].clientX;
		dy = y - event.touches[0].clientY;
	}

	function handleTouchend(event: TouchEvent) {
		const dt = Date.now() - touchTime;
		let eventType: Nullish<EventName> = null;

		const changedTouches =
			event.changedTouches ||
			event.touches ||
			[];

		if (Math.abs(dx) > Math.abs(dy)) {
			if (Math.abs(dx) > threshold && dt < timeout) {
				eventType = (dx > 0)
					? "swipe-left"
					: "swipe-right";
			}
		}

		else if (Math.abs(dy) > threshold && dt < timeout) {
			eventType = (dy > 0)
				? "swipe-up"
				: "swipe-down";
		}

		if (eventType) {
			const lastTouch = changedTouches[0];

			const [ x2, y2 ] = lastTouch
				? [ lastTouch.clientX, lastTouch.clientY ]
				: [ -1, -1 ];

			const detail = {
				direction: eventType.replace(/swipe-/, ""),
				x1: Math.round(x),
				y1: Math.round(y),
				x2,
				y2
			};

			node.dispatchEvent(new CustomEvent("swipe", { cancelable: true, detail }));
			node.dispatchEvent(new CustomEvent(eventType, { cancelable: true, detail }));
		}

		x = NaN;
		y = NaN;
		touchTime = NaN;
	}

	node.addEventListener("touchstart", handleTouchstart, { passive: true });
	node.addEventListener("touchmove", handleTouchmove, { passive: true });
	node.addEventListener("touchend", handleTouchend, { passive: true });

	return {
		destroy() {
			node.removeEventListener("touchstart", handleTouchstart);
			node.removeEventListener("touchmove", handleTouchmove);
			node.removeEventListener("touchend", handleTouchend);
		}
	};
};
