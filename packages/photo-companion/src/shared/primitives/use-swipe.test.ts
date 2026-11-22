import { cleanup, fireEvent } from "@solidjs/testing-library";
import { renderHook } from "~test/render-hook";
import { flush } from "solid-js";
import { afterEach, expect, it, vi } from "vitest";

import { useSwipe } from "./use-swipe";

afterEach(() => {
	cleanup();
	vi.useRealTimers();
});

it("uses the final gesture timestamp before deciding whether to navigate", () => {
	vi.useFakeTimers();
	vi.setSystemTime(1000);

	const element = document.createElement("div");
	const onSwipeEnd = vi.fn();

	renderHook(() => useSwipe(element, { onSwipeEnd }));

	const touch = (x: number) => ({
		touches: [{
			clientX: x,
			clientY: 0
		}]
	});

	flush(() => fireEvent.touchStart(element, touch(100)));
	flush(() => fireEvent.touchMove(element, touch(0)));

	vi.setSystemTime(1100);
	fireEvent.touchEnd(element);
	expect(onSwipeEnd).toHaveBeenCalledWith(expect.any(TouchEvent), "LEFT");
	onSwipeEnd.mockClear();

	flush(() => fireEvent.touchStart(element, touch(0)));
	flush(() => fireEvent.touchMove(element, touch(100)));

	vi.setSystemTime(2000);
	fireEvent.touchEnd(element);
	expect(onSwipeEnd).not.toHaveBeenCalled();
});
