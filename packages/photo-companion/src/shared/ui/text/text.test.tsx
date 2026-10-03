import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { Text } from "./text";

describe("Text", () => {
	it("renders a medium text span by default", () => {
		const view = render(() => <Text>Forecast</Text>);
		const text = view.getByText("Forecast");

		expect(text.tagName).toBe("SPAN");
		expect(text).toHaveAttribute("data-color", "inherit");
		expect(text).toHaveAttribute("data-variant", "text-m");
		expect(text).not.toHaveAttribute("data-numeric");
	});

	it("supports semantic elements and their native attributes", () => {
		const view = render(() => (
			<Text
				align="center"
				as="time"
				balance
				color="secondary"
				datetime="2027-04-05T12:45:36.000Z"
				leading="relaxed"
				numeric
				variant="text-xs"
			>
				12:45
			</Text>
		));
		const text = view.getByText("12:45");

		expect(text.tagName).toBe("TIME");
		expect(text).toHaveAttribute("datetime", "2027-04-05T12:45:36.000Z");
		expect(text).toHaveAttribute("data-align", "center");
		expect(text).toHaveAttribute("data-balance");
		expect(text).toHaveAttribute("data-color", "secondary");
		expect(text).toHaveAttribute("data-leading", "relaxed");
		expect(text).toHaveAttribute("data-numeric");
		expect(text).toHaveAttribute("data-variant", "text-xs");
	});
});
