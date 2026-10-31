import { render, within } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { assert, describe, expect, it, vi } from "vitest";

import { createSunlightDay } from "../../lib";
import { SunlightWidget } from "./sunlight-widget";

vi.mock("~/features/translation", async () => {
	const { timeShortFormatter } = await import("utils/formatters");
	const { t } = await import("~/features/translation/consts/translation.en");
	const { formatMessage } = await import("~/features/translation/lib/format-message");

	return {
		useTranslation: () => ({
			format: () => ({
				message: formatMessage,
				timeShort: timeShortFormatter("en")
			}),
			lang: () => "en",
			t: () => t
		})
	};
});

describe("SunlightWidget", () => {
	it("rounds the next phase countdown up to whole minutes and carries full hours", () => {
		const day = createSunlightDay(new Date("2026-09-21T12:00:00Z"), {
			latitude: 51.5,
			longitude: 0
		});

		const daylight = day.intervals.find(interval => interval.phase === "daylight");
		assert.isDefined(daylight);

		const [ date, setDate ] = createSignal(new Date(daylight.end - 59 * 60_000 - 1000));
		const view = render(() => <SunlightWidget date={date()} latitude={51.5} longitude={0} />);
		expect(view.getByText("Golden hour in 1 hr")).toBeInTheDocument();

		setDate(new Date(daylight.end - 61_000));
		expect(view.getByText("Golden hour in 2 min")).toBeInTheDocument();
	});

	it("updates the current phase and legend from the selected time", () => {
		const [ date, setDate ] = createSignal(new Date("2026-09-21T12:00:00Z"));
		const view = render(() => <SunlightWidget date={date()} latitude={51.5} longitude={0} />);
		expect(view.getByRole("img")).toHaveAccessibleName(expect.stringContaining("12:00: Daylight"));
		expect(view.container.querySelector("tr[data-active=true]")).toHaveTextContent("Daylight");
		expect(view.getByText(/^Golden hour in \d+ hr/)).toBeInTheDocument();
		const table = within(view.getByRole("table", { name: "Sunlight" }));
		expect(table.getAllByRole("row")).toHaveLength(8);
		expect(table.getByRole("rowheader", { name: "Civil twilight" })).toBeInTheDocument();
		expect(table.getByRole("rowheader", { name: "Nautical twilight" })).toBeInTheDocument();
		expect(table.getByRole("rowheader", { name: "Astronomical twilight" })).toBeInTheDocument();
		expect(view.getByText("Daylight", { selector: "p" }).parentElement?.querySelector("time")).toBeNull();
		expect(view.queryByText("Sunrise", { exact: true })).not.toBeInTheDocument();
		expect(view.queryByText("Sunset", { exact: true })).not.toBeInTheDocument();

		setDate(new Date("2026-09-21T18:30:00Z"));
		expect(view.getByRole("img")).toHaveAccessibleName(expect.stringContaining("18:30: Blue hour"));
		expect(view.container.querySelector("tr[data-active=true]")).toHaveTextContent("Blue hour");
		expect(view.container.querySelector("[data-marker=current]")).toHaveAttribute("data-phase", "blue");
		expect(view.getByText("Nautical twilight in 18 min")).toBeInTheDocument();

		setDate(new Date("2026-09-21T18:31:00Z"));
		expect(view.getByText("Nautical twilight in 17 min")).toBeInTheDocument();

		setDate(new Date("2026-09-21T23:30:00Z"));
		expect(view.getByText(/^Astronomical twilight in \d+ hr/)).toBeInTheDocument();

		setDate(new Date("2026-09-22T12:00:00Z"));
		expect(view.container.querySelector("tr[data-active=true]")).toHaveTextContent("Daylight");
		expect(view.container.querySelector("tbody time")).toHaveAttribute("datetime", expect.stringContaining("2026-09-22"));
	});

	it("keeps absent phases empty and displays a continuous polar phase as all day", () => {
		const view = render(() => <SunlightWidget
			date={new Date("2026-06-21T12:00:00Z")}
			latitude={90}
			longitude={0}
		/>);

		expect(view.getByText("All day")).toBeInTheDocument();
		expect(view.getByText("No change today")).toBeInTheDocument();
		expect(view.container.querySelectorAll("tbody td")).toHaveLength(12);
		expect(view.getAllByText("—")).toHaveLength(11);
		expect(view.queryByText("Sunrise")).not.toBeInTheDocument();
		expect(view.queryByText("Sunset")).not.toBeInTheDocument();
	});
});
