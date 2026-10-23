import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
import { render } from "@solidjs/testing-library";
import { getMoonEvents } from "moon-sun-calc";
import { getDayStart, shiftDate } from "utils/date";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createQueryDate } from "~/shared/lib/query-date";

import { MoonProvider } from "../../model/moon.context";
import { MoonTimes } from "../../ui/moon-times/moon-times";

const state = vi.hoisted(() => ({
	date: new Date("2026-10-21T00:00:00Z"),
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
	return getMoonEvents({
		interval: { end: shiftDate(start, "day", 1).getTime(), start },
		observer: state.settings
	}).filter(event => event.name === "MOONRISE" || event.name === "MOONSET");
}

function renderTimes() {
	const history = createMemoryHistory();
	history.set({ value: "/moon?latitude=0&longitude=0&source=test" });
	return render(() => (
		<MemoryRouter history={history}>
			<Route component={() => <MoonProvider><MoonTimes /></MoonProvider>} path="/moon" />
		</MemoryRouter>
	));
}

beforeEach(() => {
	state.date = new Date("2026-10-21T00:00:00Z");
	state.settings = { latitude: 0, longitude: 0 };
});

describe("MoonTimes", () => {
	it("uses the actual previous rise and following set across midnight", () => {
		const day = getDayStart(state.date);
		const events = [ -1, 0, 1 ].flatMap(offset => {
			const start = shiftDate(day, "day", offset).getTime();
			return getMoonEvents({
				interval: { end: shiftDate(start, "day", 1).getTime(), start },
				observer: { latitude: 0, longitude: 0 }
			});
		});
		const rise = events.find(event => event.name === "MOONRISE" && event.time.getTime() < day);
		const set = events.find(event => event.name === "MOONSET" && event.time.getTime() >= day);

		expect(rise).toBeDefined();
		expect(set).toBeDefined();
		const view = renderTimes();
		const times = view.container.querySelectorAll("time");

		expect(view.getByText("Moonrise")).toBeInTheDocument();
		expect(view.getByText("Moonset")).toBeInTheDocument();
		expect(times[0]).toHaveAttribute("datetime", rise?.time.toISOString());
		expect(times[1]).toHaveAttribute("datetime", set?.time.toISOString());
		expect(view.getByText("(Previous day)")).toBeInTheDocument();
		for (const time of times) {
			const link = time.querySelector("a");
			const url = new URL(link?.getAttribute("href") ?? "", "https://example.com");
			expect(url.pathname).toBe("/moon");
			expect(url.searchParams.get("source")).toBe("test");
			expect(url.searchParams.get("latitude")).toBe("0");
			expect(url.searchParams.get("longitude")).toBe("0");
			expect(url.searchParams.get("datetime")).toBe(createQueryDate(new Date(time.getAttribute("datetime") ?? "")));
			expect(link).toHaveAttribute("noscroll");
		}
		expect(view.container.querySelector("[data-position-marker]")).toBeInTheDocument();
	});

	it("keeps the center dim at the actual rise event while its altitude is still below zero", () => {
		const rise = getDayEvents(state.date).find(event => event.name === "MOONRISE");
		if (!rise) {
			throw new Error("Expected moonrise at the equator");
		}
		state.date = rise.time;
		const view = renderTimes();

		expect(view.container.querySelector("[data-below-horizon]")).toBeInTheDocument();
		expect(view.container.querySelector("[data-position-marker]")).toBeInTheDocument();
	});

	it.each([
		[ 1, false ],
		[ 15, true ]
	] as const)("uses altitude independently of missing crossings at high latitude on January %i", (day, belowHorizon) => {
		state.date = new Date(2026, 0, day, 12);
		state.settings = { latitude: 78.2232, longitude: 15.6469 };
		const view = renderTimes();

		expect(view.getAllByText("—")).toHaveLength(2);
		expect(view.queryAllByRole("link")).toHaveLength(0);
		expect(view.container.querySelector("[data-position-marker]")).toBeNull();
		expect(view.container.querySelector("[data-rise-set-progress]")).toBeNull();
		expect(Boolean(view.container.querySelector("[data-below-horizon]"))).toBe(belowHorizon);
		expect(view.getByRole("img")).toHaveAccessibleDescription(
			belowHorizon ? "Below horizon. No rise or set times nearby." : "Above horizon. No rise or set times nearby."
		);
	});
});
