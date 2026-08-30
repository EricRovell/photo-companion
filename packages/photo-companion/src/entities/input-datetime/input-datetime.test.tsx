import { createEvent, fireEvent, render, waitFor } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InputDatetime } from "./index";

afterEach(() => vi.unstubAllGlobals());

describe("InputDatetime", () => {
	it("uses second precision and preserves seconds when changing the day", async () => {
		const handleDatetimeChange = vi.fn();
		vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));

		const view = render(() => (
			<InputDatetime
				onDatetimeChange={handleDatetimeChange}
				value="2027-04-05T12:45:36"
			/>
		));

		const input = view.getByLabelText("Date and time");

		if (!(input instanceof HTMLInputElement)) {
			throw new TypeError("Expected a datetime input");
		}

		expect(input.step).toBe("1");
		expect(input.value).toBe("2027-04-05T12:45:36.000");

		fireEvent.keyDown(view.getByRole("slider", { name: "Change date and time" }), {
			key: "ArrowRight"
		});

		await waitFor(() => {
			expect(handleDatetimeChange).toHaveBeenCalledWith("2027-04-06T12:45:36");
		});
	});

	it("passes a browser-normalized value to the input adapter", () => {
		const handleDatetimeChange = vi.fn();

		const view = render(() => (
			<InputDatetime onDatetimeChange={handleDatetimeChange} />
		));

		const input = view.getByLabelText("Date and time");

		fireEvent.change(input, { target: { value: "2027-04-05T12:45" } });

		expect(handleDatetimeChange).toHaveBeenCalledWith("2027-04-05T12:45");
	});

	it("commits a dragged date when the pointer is released", () => {
		const handleDatetimeChange = vi.fn();
		vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));

		const view = render(() => (
			<InputDatetime
				onDatetimeChange={handleDatetimeChange}
				value="2027-04-05T12:45:36"
			/>
		));

		const slider = view.getByRole("slider", { name: "Change date and time" });
		const pointerDown = createEvent.pointerDown(slider, {
			button: 0,
			clientX: 100,
			pointerId: 1
		});
		const pointerMove = createEvent.pointerMove(slider, {
			clientX: 4,
			pointerId: 1
		});
		const pointerUp = createEvent.pointerUp(slider, {
			clientX: 4,
			pointerId: 1
		});

		Object.defineProperty(pointerDown, "timeStamp", { value: 0 });
		Object.defineProperty(pointerMove, "timeStamp", { value: 100 });
		Object.defineProperty(pointerUp, "timeStamp", { value: 300 });
		Object.defineProperty(slider, "setPointerCapture", { value: vi.fn() });

		fireEvent(slider, pointerDown);
		fireEvent(slider, pointerMove);
		fireEvent(slider, pointerUp);

		expect(handleDatetimeChange).toHaveBeenCalledWith("2027-04-06T12:45:36");
	});
});
