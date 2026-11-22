import { cleanup, createEvent, fireEvent, render, waitFor } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InputDatetime } from "./index";

afterEach(() => {
	cleanup();
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

const NEXT_DAY = String(new Date(2027, 3, 6, 12, 45, 36).getTime());

function renderAnimatingTimeline() {
	vi.useFakeTimers({ toFake: [ "cancelAnimationFrame", "performance", "requestAnimationFrame" ] });
	vi.stubGlobal("matchMedia", vi.fn(() => Object.assign(new EventTarget(), { matches: false })));

	const [ value, setValue ] = createSignal("2027-04-05T12:45:36");
	const handleDatetimeChange = vi.fn((value: string) => setValue(value));
	const view = render(() => (
		<InputDatetime
			onDatetimeChange={handleDatetimeChange}
			value={value()}
		/>
	));
	const slider = view.getByRole("slider", { name: "Change date and time" });
	const step = view.getByRole("combobox", { name: "Date and time step" });

	flush(() => fireEvent.keyDown(slider, { key: "ArrowRight" }));

	for (let frame = 0; frame < 15 && slider.getAttribute("aria-valuenow") !== NEXT_DAY; frame++) {
		flush(() => vi.advanceTimersToNextFrame());
	}

	expect(slider).toHaveAttribute("aria-valuenow", NEXT_DAY);
	expect(handleDatetimeChange).not.toHaveBeenCalled();

	return {
		handleDatetimeChange,
		setValue,
		slider,
		step
	};
}

describe("InputDatetime", () => {
	it.each([ "focus", "picker" ])("preserves an uncommitted edit during live updates after %s", (interaction) => {
		const [ value, setValue ] = createSignal("2026-08-02T10:30:47");

		const handleDatetimeChange = vi.fn();

		const view = render(() => <InputDatetime
			onDatetimeChange={handleDatetimeChange}
			value={value()}
		/>);
		const input = view.getByLabelText<HTMLInputElement>("Date and time");

		if (interaction === "picker") {
			const showPicker = vi.fn();
			Object.defineProperty(input, "showPicker", { value: showPicker });
			fireEvent.click(view.getByRole("button", { name: "Open date and time picker" }));
			flush();
			expect(showPicker).toHaveBeenCalledOnce();
		} else {
			input.focus();
			flush();
		}

		fireEvent.input(input, { target: { value: "2027-04-05T12:45:36" } });
		flush();
		setValue("2026-08-02T10:30:48");
		flush();
		setValue("2026-08-02T10:30:49");
		flush();

		expect(input.value).toBe("2027-04-05T12:45:36.000");
		expect(handleDatetimeChange).not.toHaveBeenCalled();
		fireEvent.change(input);
		flush();
		expect(handleDatetimeChange).toHaveBeenCalledWith("2027-04-05T12:45:36.000");
	});

	it("resumes live input updates when an edit is abandoned", () => {
		const [ value, setValue ] = createSignal("2026-08-02T10:30:47");

		const handleDatetimeChange = vi.fn();

		const view = render(() => <InputDatetime
			onDatetimeChange={handleDatetimeChange}
			value={value()}
		/>);

		const input = view.getByLabelText<HTMLInputElement>("Date and time");

		input.focus();
		flush();
		fireEvent.input(input, { target: { value: "2027-04-05T12:45:36" } });
		flush();
		setValue("2026-08-02T10:30:48");
		flush();
		input.blur();
		flush();

		expect(input.value).toBe("2026-08-02T10:30:48.000");
		setValue("2026-08-02T10:30:49");
		flush();
		expect(input.value).toBe("2026-08-02T10:30:49.000");
		expect(handleDatetimeChange).not.toHaveBeenCalled();
	});

	it("uses second precision and preserves seconds when changing the day", async () => {
		const handleDatetimeChange = vi.fn();
		vi.stubGlobal("matchMedia", vi.fn(() => Object.assign(new EventTarget(), { matches: true })));

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
		flush();

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
		flush();

		expect(handleDatetimeChange).toHaveBeenCalledWith("2027-04-05T12:45");
	});

	it("advances from the displayed date when an arrow key interrupts the animation", () => {
		const { handleDatetimeChange, slider } = renderAnimatingTimeline();

		flush(() => fireEvent.keyDown(slider, { key: "ArrowRight" }));
		flush(() => vi.advanceTimersByTime(1000));

		expect(handleDatetimeChange).toHaveBeenCalledExactlyOnceWith("2027-04-07T12:45:36");
	});

	it("preserves the displayed date when changing the step during animation", () => {
		const { handleDatetimeChange, slider, step } = renderAnimatingTimeline();

		flush(() => fireEvent.change(step, { target: { value: "hour" } }));

		expect(slider).toHaveAttribute("aria-valuenow", NEXT_DAY);
		expect(step).toHaveValue("hour");
		expect(handleDatetimeChange).not.toHaveBeenCalled();
	});

	it("applies an external date change once the interrupted timeline is idle", () => {
		const { setValue, slider, step } = renderAnimatingTimeline();
		const newDate = String(new Date(2027, 3, 10, 12, 45, 36).getTime());

		flush(() => setValue("2027-04-10T12:45:36"));
		expect(slider).toHaveAttribute("aria-valuenow", NEXT_DAY);

		flush(() => fireEvent.change(step, { target: { value: "hour" } }));

		expect(slider).toHaveAttribute("aria-valuenow", newDate);
	});

	it("commits a dragged date when the pointer is released", () => {
		const handleDatetimeChange = vi.fn();
		vi.stubGlobal("matchMedia", vi.fn(() => Object.assign(new EventTarget(), { matches: true })));

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
		flush();
		fireEvent(slider, pointerMove);
		flush();
		fireEvent(slider, pointerUp);
		flush();

		expect(handleDatetimeChange).toHaveBeenCalledWith("2027-04-06T12:45:36");
	});
});
