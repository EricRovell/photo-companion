import { createRouter, memoryHistory } from "@solidjs/router";
import { render } from "@solidjs/testing-library";
import { isNullable } from "utils/validators";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { configureTranslationMock } from "~/features/translation/test";

import { SunSeasons } from "./sun-seasons";

import type { DatetimeMock } from "~/features/datetime-query/types";

vi.mock<DatetimeMock>(import("~/features/datetime-query"), () => ({
	useDatetime: () => ({
		getDatetime: () => new Date(2040, 6, 15)
	})
}));

vi.mock(import("~/features/translation"));

describe("SunSeasons", () => {
	beforeEach(() => {
		configureTranslationMock({
			format: {
				dateShort: date => isNullable(date) ? "" : `20.03.${new Date(date).getFullYear()}`,
				timeShort: () => "12:34"
			}
		});
	});

	it("renders the four events for the selected datetime's local year", () => {
		const history = memoryHistory();

		history.set({
			replace: true,
			scroll: false,
			value: "/sun?source=test"
		});

		const Router = createRouter({
			history,
			routes: [{
				component: SunSeasons,
				path: "/sun"
			}]
		});
		const view = render(() => (
			<Router />
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
