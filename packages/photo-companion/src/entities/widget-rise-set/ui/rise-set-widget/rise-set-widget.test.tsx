import { render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RiseSetWidget } from "./rise-set-widget";

import type { RiseSetWidgetProps } from "../../types";

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

const defaults: RiseSetWidgetProps = {
	aboveHorizon: false,
	belowHorizonInterval: {
		end: new Date("2026-10-21T06:00:00Z"),
		start: new Date("2026-10-20T18:00:00Z")
	},
	date: new Date("2026-10-21T04:57:57Z"),
	entity: "sun",
	nextRise: new Date("2026-10-21T06:00:00Z"),
	rise: new Date("2026-10-21T06:00:00Z"),
	set: new Date("2026-10-21T18:00:00Z")
};

const nextRise = new Date("2026-10-22T07:00:00Z");

const followingNight = {
	end: nextRise,
	start: new Date("2026-10-21T18:00:00Z")
};

describe("RiseSetWidget countdown", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-10-24T12:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it.each([ "moon", "sun" ] as const)("counts down to %s rise from the selected date below the horizon", (entity) => {
		const view = render(() => <RiseSetWidget {...defaults} entity={entity} />);

		expect(view.getByText(entity === "moon" ? "Until moonrise" : "Until sunrise")).toBeInTheDocument();
		expect(view.getByText("01:02:03")).toBeInTheDocument();
		expect(view.getByText("Below horizon")).toBeInTheDocument();
		expect(view.getByText("12h")).toBeInTheDocument();
		vi.advanceTimersByTime(1000);
		expect(view.getByText("01:02:02")).toBeInTheDocument();
	});

	it.each([ "moon", "sun" ] as const)("shows total duration and time until %s set above the horizon", (entity) => {
		const view = render(() => (
			<RiseSetWidget
				{...defaults}
				aboveHorizon
				date={new Date("2026-10-21T12:57:57Z")}
				entity={entity}
			/>
		));

		expect(view.getByText(entity === "moon" ? "Above horizon" : "Daylight")).toBeInTheDocument();
		expect(view.getByText("12h")).toBeInTheDocument();
		expect(view.getByText(entity === "moon" ? "Until moonset" : "Until sunset")).toBeInTheDocument();
		expect(view.getByText("05:02:03")).toBeInTheDocument();
		vi.advanceTimersByTime(1000);
		expect(view.getByText("05:02:02")).toBeInTheDocument();
	});

	it("shows a rise countdown even when the set is missing", () => {
		const view = render(() => <RiseSetWidget {...defaults} set={null} />);

		expect(view.getByText("01:02:03")).toBeInTheDocument();
		expect(view.getByRole("img")).toHaveAccessibleDescription("Set time unavailable; progress cannot be shown.");
	});

	it("shows a set countdown even when the rise is missing", () => {
		const view = render(() => (
			<RiseSetWidget
				{...defaults}
				aboveHorizon
				date={new Date("2026-10-21T12:00:00Z")}
				rise={null}
			/>)
		);

		expect(view.getByText("06:00:00")).toBeInTheDocument();
		expect(view.getByRole("img")).toHaveAccessibleDescription("Rise time unavailable; progress cannot be shown.");
	});

	it("stops at zero without restarting or showing a negative time", () => {
		const view = render(() => <RiseSetWidget
			{...defaults}
			date={new Date("2026-10-21T05:59:59Z")}
		/>);

		vi.advanceTimersByTime(1000);
		expect(view.getByText("00:00:00")).toBeInTheDocument();
		vi.advanceTimersByTime(5000);
		expect(view.getByText("00:00:00")).toBeInTheDocument();
	});

	it.each([
		[ "2026-10-21T06:00:00Z", defaults.belowHorizonInterval, "12h", "25:00:00" ],
		[ "2026-10-21T18:00:00Z", followingNight, "13h", "13:00:00" ],
		[ "2026-10-21T20:00:00Z", followingNight, "13h", "11:00:00" ]
	] as const)("keeps duration and counts down to the actual next rise at %s", (date, belowHorizonInterval, duration, countdown) => {
		const view = render(() => (
			<RiseSetWidget
				{...defaults}
				belowHorizonInterval={belowHorizonInterval}
				date={new Date(date)}
				nextRise={nextRise}
			/>)
		);

		expect(view.getByText("Below horizon")).toBeInTheDocument();
		expect(view.getByText(duration)).toBeInTheDocument();
		expect(view.getByText("Until sunrise")).toBeInTheDocument();
		expect(view.getByText(countdown)).toBeInTheDocument();
	});

	it("resets when the selected date, horizon state, or event changes", () => {
		const [ props, setProps ] = createSignal(defaults);
		const view = render(() => <RiseSetWidget {...props()} />);

		vi.advanceTimersByTime(3000);
		setProps({
			...defaults,
			date: new Date("2026-10-21T05:00:00Z")
		});
		expect(view.getByText("01:00:00")).toBeInTheDocument();

		setProps({
			...defaults,
			aboveHorizon: true,
			date: new Date("2026-10-21T12:00:00Z")
		});
		expect(view.getByText("06:00:00")).toBeInTheDocument();
		expect(view.queryByText("Until sunrise")).toBeNull();

		setProps(value => ({
			...value,
			set: new Date("2026-10-22T18:00:00Z")
		}));
		expect(view.getByText("30:00:00")).toBeInTheDocument();
		vi.advanceTimersByTime(1000);
		expect(view.getByText("29:59:59")).toBeInTheDocument();
	});

	it("catches up after the browser delays timer callbacks", () => {
		const view = render(() => <RiseSetWidget {...defaults} />);

		vi.setSystemTime(new Date("2026-10-24T12:00:30Z"));
		vi.advanceTimersByTime(1000);
		expect(view.getByText("01:01:32")).toBeInTheDocument();
	});

	it("keeps shared timer progress through remounts without advancing the selected date", () => {
		const [ getTimerTimestamp, setTimerTimestamp ] = createSignal(defaults.date.getTime() + 30_000);

		const view = render(() => <RiseSetWidget
			{...defaults}
			getTimerTimestamp={getTimerTimestamp}
		/>);

		expect(view.getByText("01:01:33")).toBeInTheDocument();
		vi.advanceTimersByTime(1000);
		expect(view.getByText("01:01:33")).toBeInTheDocument();
		setTimerTimestamp(defaults.date.getTime() + 31_000);
		expect(view.getByText("01:01:32")).toBeInTheDocument();

		view.unmount();

		const remounted = render(() => <RiseSetWidget
			{...defaults}
			getTimerTimestamp={getTimerTimestamp}
		/>);

		expect(remounted.getByText("01:01:32")).toBeInTheDocument();
	});

	it.each([
		{ rise: null },
		{ date: new Date("2026-10-21T20:00:00Z") },
		{
			aboveHorizon: true,
			set: null
		}
	])("keeps an unavailable value without an upcoming event: %o", (overrides) => {
		const view = render(() => <RiseSetWidget {...defaults} {...overrides} nextRise={null} />);

		expect(view.container.querySelector("[data-rise-set-countdown] dd")).toHaveTextContent("—");
		expect(view.container.querySelectorAll("dl > div")).toHaveLength(2);
	});
});
