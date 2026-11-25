import { createRouter, memoryHistory } from "@solidjs/router";
import { cleanup, fireEvent, render, waitFor, within } from "@solidjs/testing-library";
import { afterEach, assert, describe, expect, it, vi } from "vitest";

import { DatetimeProvider, useDatetime } from "~/features/datetime-query";
import { SettingsProvider } from "~/features/settings";
import { ROUTES } from "~/shared/consts";
import { createQueryDate } from "~/shared/lib/query-date";
import { StoryTranslationProvider } from "~/stories/story-language";

import { MoonPhasesCalendar } from "./moon-phases-calendar";

import dayCellStyles from "../moon-calendar-day-cell/moon-calendar-day-cell.module.css";

function SelectedDatetime() {
	const { getDatetimeQuery } = useDatetime();

	return <output>{getDatetimeQuery()}</output>;
}

function renderCalendar(date: Date) {
	const query = new URLSearchParams({
		datetime: createQueryDate(date),
		latitude: "51.5"
	});

	const history = memoryHistory(`${ROUTES.MOON}?${query.toString()}`);

	const Router = createRouter({
		history,
		routes: [{
			component: () => (
				<DatetimeProvider>
					<SettingsProvider>
						<StoryTranslationProvider>
							<MoonPhasesCalendar />
							<SelectedDatetime />
						</StoryTranslationProvider>
					</SettingsProvider>
				</DatetimeProvider>
			),
			path: ROUTES.MOON
		}]
	});

	return {
		history,
		...render(() => <Router />)
	};
}

describe("MoonPhasesCalendar", () => {
	afterEach(() => {
		cleanup();
		vi.useRealTimers();
	});

	it("browses across a year boundary and shows every day of a leap month", async () => {
		const view = renderCalendar(new Date(2027, 11, 31, 23));
		const december = await view.findByRole("table", { name: "December 2027" });
		expect(within(december).getByRole("link", { name: /^December 31, 2027/ })).toHaveTextContent("31");

		const next = view.getByRole("button", { name: "Next month" });
		fireEvent.click(next);
		const january = await view.findByRole("table", { name: "January 2028" });
		expect(within(january).getAllByRole("row")).toHaveLength(7);
		expect(within(january).getAllByRole("columnheader")[0]).toHaveAccessibleName("Monday");

		fireEvent.click(next);
		const february = within(await view.findByRole("table", { name: "February 2028" }));
		expect(february.getAllByRole("link")).toHaveLength(35);
		expect(february.getAllByRole("cell").filter(cell => !cell.hasAttribute("data-outside-month"))).toHaveLength(29);
		expect(view.getByRole("status")).toHaveTextContent("2027-12-31T23:00:00");

		fireEvent.click(view.getByRole("button", { name: "Previous month" }));
		expect(await view.findByRole("table", { name: "January 2028" })).toBeInTheDocument();
	});

	it("links ordinary and primary phase dates at the app's displayed time", async () => {
		const view = renderCalendar(new Date(2026, 10, 23, 9, 14, 37));
		const table = within(await view.findByRole("table", { name: "November 2026" }));
		const ordinary = table.getByRole("link", { name: /^November 22, 2026/ });
		expect(ordinary).toHaveAttribute("href", expect.stringContaining("datetime=2026-11-22T09%3A14%3A37"));
		expect(ordinary).toHaveAttribute("href", expect.stringContaining("latitude=51.5"));
		expect(ordinary).toHaveAttribute("noscroll");

		const firstQuarter = table.getByRole("link", { name: /First Quarter/ });
		expect(firstQuarter.querySelector("[data-right]")).toHaveAttribute("class", expect.stringContaining("visible"));

		const fullMoon = table.getByRole("link", { name: /^November .*Full Moon/ });
		expect(fullMoon.querySelector("time")).toHaveClass(dayCellStyles["principal-phase"]);
		expect(fullMoon).toHaveAccessibleName(expect.stringContaining("Full Moon · 14:53"));

		view.history.set({ value: "/moon?datetime=2026-11-23T19%3A16%3A21&latitude=51.5" });
		await waitFor(() => {
			expect(fullMoon).toHaveAttribute("href", expect.stringContaining("datetime=2026-11-24T19%3A16%3A21"));
		});

		const href = fullMoon.getAttribute("href");
		assert.isNotNull(href);

		view.history.set({ value: href });
		await waitFor(() => {
			expect(view.getByRole("status")).toHaveTextContent("2026-11-24T19:16:21");
		});
	});

	it("shows moon phases and links for dates in both adjacent months", async () => {
		const view = renderCalendar(new Date(2026, 10, 23, 9));
		const table = within(await view.findByRole("table", { name: "November 2026" }));
		const previous = table.getByRole("link", { name: /^October 26, 2026/ });
		const next = table.getByRole("link", { name: /^December 1, 2026/ });

		expect(previous.closest("td")).toHaveAttribute("data-outside-month");
		expect(next.closest("td")).toHaveAttribute("data-outside-month");
		expect(previous.querySelector("svg")).toBeInTheDocument();
		expect(next.querySelector("svg")).toBeInTheDocument();
		expect(table.getByRole("link", { name: /^November 1, 2026/ }).closest("td")).not.toHaveAttribute("data-outside-month");

		const href = next.getAttribute("href");
		assert.isNotNull(href);
		expect(href).toContain("datetime=2026-12-01T09%3A00%3A00");
		view.history.set({ value: href });
		expect(await view.findByRole("table", { name: "December 2026" })).toBeInTheDocument();
	});

	it("marks the date from the datetime control and follows date changes", async () => {
		vi.useFakeTimers({ toFake: [ "Date" ] });
		vi.setSystemTime(new Date(2026, 10, 21, 12));
		const view = renderCalendar(new Date(2026, 10, 23, 9));
		const table = within(await view.findByRole("table", { name: "November 2026" }));
		const today = table.getByRole("link", { name: /^November 21, 2026/ });
		const nextDate = table.getByRole("link", { name: /^November 25, 2026/ });

		expect(table.getByRole("link", { current: "date" })).toHaveTextContent("23");
		expect(today).not.toHaveAttribute("aria-current", "date");

		const href = nextDate.getAttribute("href");
		assert.isNotNull(href);

		view.history.set({ value: href });
		await waitFor(() => {
			expect(table.getByRole("link", { current: "date" })).toHaveTextContent("25");
			expect(view.getByRole("status")).toHaveTextContent("2026-11-25T09:00:00");
		});
	});
});
