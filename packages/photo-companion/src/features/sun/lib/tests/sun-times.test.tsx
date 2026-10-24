import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
import { render } from "@solidjs/testing-library";
import { getSunEvents } from "moon-sun-calc";
import { getDayStart, shiftDate } from "utils/date";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createQueryDate } from "~/shared/lib/query-date";

import { SunProvider } from "../../model";
import { SunTimes } from "../../ui/sun-times";

const state = vi.hoisted(() => ({
	date: new Date("2026-10-21T12:00:00Z"),
	settings: { latitude: 0, longitude: 0 }
}));

vi.mock("~/features/datetime-query", () => ({
	useDatetime: () => ({ getDatetime: () => state.date })
}));

vi.mock("~/features/settings", () => ({
	useSettings: () => ({ settings: state.settings })
}));

vi.mock("~/features/translation", async () => {
	const { t } = await import("~/features/translation/consts/translation.en");
	return {
		useTranslation: () => ({
			format: () => ({
				dateShort: (date: Date) => date.toISOString().slice(0, 10),
				timeShort: (date: Nullish<Date>) => date?.toISOString() ?? ""
			}),
			lang: () => "en",
			t: () => t
		})
	};
});

function getDayEvents(date: DateLike) {
	const start = getDayStart(date);
	return getSunEvents({
		interval: { end: shiftDate(start, "day", 1).getTime(), start },
		observer: state.settings
	}).filter(event => event.name === "SUNRISE_START" || event.name === "SUNSET_END");
}

function renderTimes() {
	const history = createMemoryHistory();
	history.set({ value: "/sun?latitude=0&longitude=0&source=test" });
	return render(() => (
		<MemoryRouter history={history}>
			<Route
				component={() => <SunProvider><SunTimes /></SunProvider>}
				path="/sun"
			/>
		</MemoryRouter>
	));
}

beforeEach(() => {
	state.date = new Date("2026-10-21T12:00:00Z");
	state.settings = { latitude: 0, longitude: 0 };
});

describe("SunTimes", () => {
	it("renders actual rise and set events through the sun service", () => {
		const view = renderTimes();
		const times = view.container.querySelectorAll("time");

		expect(view.getByRole("heading", { name: "The Sun Times" })).toBeInTheDocument();
		expect(view.getByText("Sunrise")).toBeInTheDocument();
		expect(view.getByText("Sunset")).toBeInTheDocument();
		expect(times).toHaveLength(2);
		for (const time of times) {
			expect(time.getAttribute("datetime")).toMatch(/^2026-10-21T/);
			const link = time.querySelector("a");
			const url = new URL(link?.getAttribute("href") ?? "", "https://example.com");
			expect(url.pathname).toBe("/sun");
			expect(url.searchParams.get("source")).toBe("test");
			expect(url.searchParams.get("latitude")).toBe("0");
			expect(url.searchParams.get("longitude")).toBe("0");
			expect(url.searchParams.get("datetime")).toBe(createQueryDate(new Date(time.getAttribute("datetime") ?? "")));
			expect(link).toHaveAttribute("noscroll");
		}
		expect(view.container.querySelector("[data-position-marker]")).toBeInTheDocument();
	});

	it("keeps the sun dim at sunrise while its center is still below zero altitude", () => {
		const rise = getDayEvents(state.date).find(event => event.name === "SUNRISE_START");
		if (!rise) {
			throw new Error("Expected sunrise at the equator");
		}
		state.date = rise.time;
		const view = renderTimes();

		expect(view.container.querySelector("[data-below-horizon]")).toBeInTheDocument();
		expect(view.container.querySelector("[data-position-marker]")).toBeInTheDocument();
	});

	it.each([ "SUNRISE_START", "SUNSET_END" ])("keeps below-horizon duration and the next rise countdown at a %s link", (name) => {
		const event = getDayEvents(state.date).find(event => event.name === name);

		if (!event) {
			throw new Error(`Expected ${name} at the equator`);
		}

		state.date = new Date(Math.floor(event.time.getTime() / 1000) * 1000);

		const view = renderTimes();
		const countdown = view.container.querySelector("[data-rise-set-countdown] dd")?.textContent ?? "";

		expect(view.getByText("Below horizon")).toBeInTheDocument();
		expect(view.getByText("Until sunrise")).toBeInTheDocument();
		expect(view.container.querySelector("[data-rise-set-duration] dd")).not.toHaveTextContent("—");
		expect(Number(countdown.split(":")[0])).toBeGreaterThan(1);
	});

	it.each([
		[ 5, false ],
		[ 11, true ]
	] as const)("uses altitude independently of missing crossings during polar conditions in month %i", (month, belowHorizon) => {
		state.date = new Date(2026, month, 21, 12);
		state.settings = { latitude: 78.2232, longitude: 15.6469 };
		const view = renderTimes();

		expect(view.getAllByText("—")).toHaveLength(4);
		expect(view.queryAllByRole("link")).toHaveLength(0);
		expect(view.container.querySelector("[data-position-marker]")).toBeNull();
		expect(view.container.querySelector("[data-rise-set-progress]")).toBeNull();
		expect(Boolean(view.container.querySelector("[data-below-horizon]"))).toBe(belowHorizon);
		expect(view.getByRole("img")).toHaveAccessibleDescription(
			belowHorizon ? "Below horizon. No rise or set times nearby." : "Above horizon. No rise or set times nearby."
		);
	});
});
