import { type Accessor, createMemo } from "solid-js";
import { createStore } from "solid-js/store";

import { createEventListener } from "./create-event-listener";

type MaybeAccessor<T> = Accessor<T> | T;

export interface Coords {
	t1: number;
	t2: number;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

export type SwipeDirection =
	| "DOWN"
	| "LEFT"
	| "NONE"
	| "RIGHT"
	| "UP";

type SwipeCallback = (event: TouchEvent) => void;

export interface Options {
	onSwipe?: SwipeCallback;
	onSwipeEnd?: (e: TouchEvent, direction: SwipeDirection) => void;
	onSwipeStart?: SwipeCallback;
	threshold?: number;
	timeout?: number;
}

export interface UseSwipeReturn {
	coords: Readonly<Coords>;
	dx: Accessor<number>;
	dy: Accessor<number>;
	getDirection: Accessor<SwipeDirection>;
	stop: VoidFn;
}

/**
 * Reactive swipe detection based on [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent).
 */
export function useSwipe(target: MaybeAccessor<Nullable<HTMLElement>>, options: Options = {}): UseSwipeReturn {
	const {
		onSwipeEnd,
		onSwipeStart,
		threshold = 50,
		timeout = 750
	} = options;

	const [ coords, setCoords ] = createStore({
		t1: NaN,
		t2: NaN,
		x1: 0,
		x2: 0,
		y1: 0,
		y2: 0
	});

	const dx = createMemo(() => coords.x1 - coords.x2);
	const dy = createMemo(() => coords.y1 - coords.y2);
	const dt = createMemo(() => coords.t2 - coords.t1);

	const isOverThreshold = createMemo(() => (
		Math.max(Math.abs(dx()), Math.abs(dy())) >= threshold &&
		dt() < timeout
	));

	const getDirection = createMemo<SwipeDirection>(() => {
		if (!isOverThreshold()) {
			return "NONE";
		}

		if (Math.abs(dx()) > Math.abs(dy())) {
			return dx() > 0 ? "LEFT" : "RIGHT";
		}

		return dy() > 0 ? "UP" : "DOWN";
	});

	const getTouchCoords = (event: TouchEvent) => [
		event.touches[0].clientX,
		event.touches[0].clientY
	];

	const handleTouchStart = (event: TouchEvent) => {
		if (event.touches.length !== 1) {
			return;
		}

		const [ x, y ] = getTouchCoords(event);

		setCoords({ t1: Date.now(), x1: x, x2: x, y1: y, y2: y });
		onSwipeStart?.(event);
	};

	const handleTouchMove = (event: TouchEvent) => {
		if (event.touches.length !== 1) {
			return;
		}

		const [ x, y ] = getTouchCoords(event);

		setCoords({ x2: x, y2: y });
	};

	const handleTouchEnd = (event: TouchEvent) => {
		setCoords({ t2: Date.now() });

		if (isOverThreshold()) {
			onSwipeEnd?.(event, getDirection());
		}
	};

	const events = [
		createEventListener({
			event: "touchstart",
			listener: handleTouchStart,
			options: { passive: true },
			target
		}),
		createEventListener({
			event: "touchmove",
			listener: handleTouchMove,
			options: { passive: true },
			target
		}),
		createEventListener({
			event: "touchcancel",
			listener: handleTouchEnd,
			options: { passive: true },
			target
		}),
		createEventListener({
			event: "touchend",
			listener: handleTouchEnd,
			options: { passive: true },
			target
		})
	];

	const stop = () => events.forEach(stopFn => stopFn());

	return {
		coords,
		dx,
		dy,
		getDirection,
		stop
	};
}
