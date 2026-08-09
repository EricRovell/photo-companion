import { fireEvent, render } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";

import { InputDatetime } from "./input-datetime";

describe("InputDatetime", () => {
	it("uses second precision and preserves seconds when changing the day", () => {
		const handleDatetimeChange = vi.fn();

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

		fireEvent.click(view.getByTitle("Next day"));

		expect(handleDatetimeChange).toHaveBeenCalledWith("2027-04-06T12:45:36");
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
});
