import { createMemoryHistory, MemoryRouter, Route } from "@solidjs/router";
import { cleanup, fireEvent, render, waitFor } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CityLightsProvider } from "../model";
import { LightsSchedule } from "./lights-schedule";

vi.mock("~/features/settings", () => ({
	useSettings: () => ({
		settings: {
			city: "MOSCOW",
			latitude: 55.76,
			longitude: 37.62
		}
	})
}));

vi.mock("~/features/translation", async () => {
	const { t } = await import("~/features/translation/consts/translation.en");
	return {
		useTranslation: () => ({
			format: () => ({
				dateShort: (date: Date | number) => new Date(date).toISOString().slice(0, 10),
				datetime: (date: Date | number) => new Date(date).toISOString(),
				message: (message: string, values: Record<string, string>) => message.replace(/\{(\w+)\}/g, (_, key: string) => values[key]),
				minutes: (minutes: number) => `${minutes} min`,
				timeShort: (date: Date | number) => new Date(date).toISOString().slice(11, 16)
			}),
			lang: () => "en",
			t: () => t
		})
	};
});

function renderSchedule(datetime: string) {
	const history = createMemoryHistory();
	history.set({ value: `/lights?datetime=${datetime}&latitude=55.76&longitude=37.62&source=test` });
	const view = render(() => (
		<MemoryRouter history={history}>
			<Route
				component={() => <CityLightsProvider><LightsSchedule /></CityLightsProvider>}
				path="/lights"
			/>
		</MemoryRouter>
	));
	return {
		history,
		view
	};
}

describe("LightsSchedule links", () => {
	afterEach(cleanup);

	it.each([ "2026-10-24T20:40:00", "2026-10-25T04:00:00" ])("links each night switch to its actual calendar date at %s", (datetime) => {
		const { view } = renderSchedule(datetime);
		const on = view.getByRole("link", { name: /^Turn-on time:/ });
		const off = view.getByRole("link", { name: /^Turn-off time:/ });
		for (const [ link, timestamp ] of [
			[ on, "2026-10-24T17:21:00" ],
			[ off, "2026-10-25T06:59:00" ]
		] as const) {
			const url = new URL(link.getAttribute("href") ?? "", "https://example.com");
			expect(url.pathname).toBe("/lights");
			expect(url.searchParams.get("datetime")).toBe(timestamp);
			expect(url.searchParams.get("latitude")).toBe("55.76");
			expect(url.searchParams.get("longitude")).toBe("37.62");
			expect(url.searchParams.get("source")).toBe("test");
			expect(link).toHaveAttribute("noscroll");
		}
	});

	it("selects the switch time when a link is clicked", async () => {
		const { history, view } = renderSchedule("2026-10-24T20:40:00");
		fireEvent.click(view.getByRole("link", { name: /^Turn-off time:/ }));
		await waitFor(() => {
			const url = new URL(history.get(), "https://example.com");
			expect(url.searchParams.get("datetime")).toBe("2026-10-25T06:59:00");
			expect(view.getByRole("img")).toHaveAttribute("title", "Selected time: 2026-10-25T06:59:00.000Z");
		});
	});

	it("switches to solar times for the selected location", () => {
		const { view } = renderSchedule("2026-10-24T20:40:00");
		const officialLink = view.getByRole("link", { name: /^Turn-on time:/ }).getAttribute("href");
		fireEvent.click(view.getByRole("radio", { name: "Solar estimate" }));
		expect(view.getByRole("radio", { name: "Official schedule" })).not.toBeChecked();
		expect(view.getByRole("radio", { name: "Solar estimate" })).toBeChecked();
		expect(view.getByRole("img")).toHaveAccessibleName(/Solar estimate/);
		expect(view.getByRole("link", { name: /^Turn-on time:/ }).getAttribute("href")).not.toBe(officialLink);
		expect(view.container.querySelectorAll("[data-uncertainty-minutes=\"30\"]")).toHaveLength(2);
	});
});
