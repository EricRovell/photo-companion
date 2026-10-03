import { render } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";

import { SunSeasons } from "./sun-seasons";

vi.mock("~/features/datetime-query", () => ({
	useDatetime: () => ({
		getDatetime: () => new Date(2040, 6, 15)
	})
}));

vi.mock("~/features/translation", () => ({
	useTranslation: () => ({
		format: () => ({
			dateShort: (date: Date) => `20.03.${date.getFullYear()}`,
			timeShort: () => "12:34"
		}),
		t: () => ({
			SEASONS: {
				EQUINOX_MARCH: "March equinox",
				EQUINOX_SEPTEMBER: "September equinox",
				SOLSTICE_DECEMBER: "December solstice",
				SOLSTICE_JUNE: "June solstice",
				TITLE: "Equinoxes & Solstices"
			}
		})
	})
}));

describe("SunSeasons", () => {
	it("renders the four events for the selected datetime's local year", () => {
		const view = render(() => <SunSeasons />);
		const times = view.container.querySelectorAll("time");

		expect(view.getByText("Equinoxes & Solstices")).toBeInTheDocument();
		expect(view.getByText("March equinox")).toBeInTheDocument();
		expect(view.getByText("June solstice")).toBeInTheDocument();
		expect(view.getByText("September equinox")).toBeInTheDocument();
		expect(view.getByText("December solstice")).toBeInTheDocument();
		expect(times).toHaveLength(4);
		for (const time of times) {
			expect(time.getAttribute("datetime")).toMatch(/^2040-/);
			expect(time).toHaveTextContent("20.03.2040");
			expect(time).toHaveTextContent("12:34");
		}
		expect(view.container.querySelectorAll("time > span[data-color=\"secondary\"]")).toHaveLength(4);
	});
});
