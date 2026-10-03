import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
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
				AXIS_DECLINATION: "Solar declination",
				AXIS_MONTH: "Month",
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
		const history = createMemoryHistory();
		history.set({ replace: true, scroll: false, value: "/sun?source=test" });
		const view = render(() => (
			<MemoryRouter history={history}>
				<Route component={SunSeasons} path="/sun" />
			</MemoryRouter>
		));
		const times = view.container.querySelectorAll("time");
		const graph = view.getByRole("img", { name: /Equinoxes & Solstices/ });
		const links = view.getAllByRole("link");

		expect(view.getByText("Equinoxes & Solstices")).toBeInTheDocument();
		expect(graph).toHaveTextContent("Solar declination");
		expect(graph).toHaveTextContent("Month");
		expect(graph.querySelector("[data-season-curve]")).toBeInTheDocument();
		expect(graph.querySelectorAll("[data-season-event]")).toHaveLength(4);
		expect(graph.querySelector("[data-selected-date]")).toBeInTheDocument();
		expect(graph.querySelector("[data-selected-label]")).toHaveAttribute("text-anchor", "middle");
		expect(view.getByText("March equinox")).toBeInTheDocument();
		expect(view.getByText("June solstice")).toBeInTheDocument();
		expect(view.getByText("September equinox")).toBeInTheDocument();
		expect(view.getByText("December solstice")).toBeInTheDocument();
		expect(times).toHaveLength(4);
		expect(links).toHaveLength(4);

		for (const time of times) {
			expect(time.getAttribute("datetime")).toMatch(/^2040-/);
			expect(time).toHaveTextContent("20.03.2040");
			expect(time).toHaveTextContent("12:34");
		}

		for (const link of links) {
			const url = new URL(link.getAttribute("href") ?? "", "https://example.com");
			expect(link).toHaveAttribute("noscroll");
			expect(url.pathname).toBe("/sun");
			expect(url.searchParams.get("source")).toBe("test");
			expect(url.searchParams.get("datetime")).toMatch(/^2040-/);
		}

		expect(view.container.querySelectorAll("time > span[data-color=\"secondary\"]")).toHaveLength(4);
	});
});
