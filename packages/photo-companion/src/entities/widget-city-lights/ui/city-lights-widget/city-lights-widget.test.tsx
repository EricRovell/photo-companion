import { fireEvent, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Accessor } from "solid-js";
import type { City, IlluminationState, LightsSchedule, LightsScheduleStatus } from "types";

import { CityLightsWidget } from "./city-lights-widget";

vi.mock("~/features/translation", async () => {
	const { t } = await import("~/features/translation/consts/translation.en");
	return {
		useTranslation: () => ({
			format: () => ({
				dateShort: (date: Date | number) => new Date(date).toISOString().slice(0, 10),
				datetime: (date: Date | number) => new Date(date).toISOString(),
				message: (message: string, values: Record<string, string>) => message.replace(/\{(\w+)\}/g, (_, key: string) => values[key]),
				minutes: (minutes: number) => `${minutes} min`,
				timeDuration: (duration: number) => new Date(duration).toISOString().slice(11, 19),
				timeShort: (date: Date | number) => new Date(date).toISOString().slice(11, 16)
			}),
			lang: () => language,
			t: () => t
		})
	};
});

let language = "en";
let uncertainty = 0;
let status: LightsScheduleStatus = "SCHEDULED";
let selected = () => new Date(2026, 9, 24, 20, 40);

function getSchedule(date: Date): LightsSchedule {
	if (status !== "SCHEDULED") {
		return {
			duration: null,
			LIGHTS_END: null,
			LIGHTS_START: null,
			source: uncertainty ? "SOLAR_ESTIMATE" : "SCHEDULE",
			status,
			uncertaintyMinutes: uncertainty
		};
	}

	const start = new Date(date);
	start.setHours(18, 20, 0, 0);

	const end = new Date(date);
	end.setHours(6, 10, 0, 0);

	return {
		duration: 12 * 60 * 60_000,
		LIGHTS_END: end.getTime(),
		LIGHTS_START: start.getTime(),
		source: uncertainty ? "SOLAR_ESTIMATE" : "SCHEDULE",
		status,
		uncertaintyMinutes: uncertainty
	};
}

function getState(date: Date): IlluminationState {
	const schedule = getSchedule(date);

	if (schedule.status !== "SCHEDULED") {
		return {
			event: null,
			lights: schedule.status === "CONTINUOUS_DARKNESS",
			timestamp: null
		};
	}

	const lights = date.getTime() < schedule.LIGHTS_END || date.getTime() > schedule.LIGHTS_START;
	const next = new Date(lights ? schedule.LIGHTS_END : schedule.LIGHTS_START);

	if (date.getTime() > schedule.LIGHTS_START) {
		next.setDate(next.getDate() + 1);
	}

	return {
		event: lights ? "LIGHTS_END" : "LIGHTS_START",
		lights,
		timestamp: next.getTime()
	};
}

function getSolarSchedule(date: Date): LightsSchedule {
	return {
		...getSchedule(date),
		source: "SOLAR_ESTIMATE",
		uncertaintyMinutes: uncertainty || 30
	};
}

function TestWidget(props: {
	city?: City;
	getTimerTimestamp?: Accessor<number>;
}) {
	return (
		<CityLightsWidget
			city={props.city ?? (uncertainty ? "OTHER" : "MOSCOW")}
			date={selected()}
			getScheduleForDate={getSchedule}
			getTimerTimestamp={props.getTimerTimestamp}
			schedule={getSchedule(selected())}
			solar={{
				getScheduleForDate: getSolarSchedule,
				schedule: getSolarSchedule(selected()),
				state: getState(selected())
			}}
			state={getState(selected())}
		/>
	);
}

describe("CityLightsWidget", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-10-24T12:00:00Z"));
		uncertainty = 0;
		language = "en";
		status = "SCHEDULED";
		selected = () => new Date(2026, 9, 24, 20, 40);
	});

	afterEach(() => { vi.useRealTimers(); });

	it("shows official schedule markers and a countdown to the following morning", () => {
		const view = render(() => <TestWidget />);
		expect(view.getByText("Lights scheduled on")).toBeInTheDocument();
		expect(view.getByText("Official schedule")).toBeInTheDocument();
		expect(view.container.querySelector("header")).toHaveTextContent("Moscow");
		expect(view.getByText("09:30:00")).toBeInTheDocument();
		expect(view.container.querySelectorAll("[data-uncertainty-minutes]")).toHaveLength(0);
		expect(view.getByRole("img")).toHaveAccessibleDescription(/Turn-on time 18:20 Today.*Turn-off time 06:10 tomorrow/);
		expect(view.getByRole("img").querySelector("[data-graph-event=\"LIGHTS_START\"]")).toHaveTextContent("18:20");
		expect(view.getByRole("img").querySelector("[data-graph-event=\"LIGHTS_END\"]")).toHaveTextContent("06:10");
		expect(view.getByRole("img")).not.toHaveTextContent(/18:00|06:00|12:00/);
		expect(view.getByRole("img").compareDocumentPosition(view.getByText("09:30:00"))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
		vi.advanceTimersByTime(1000);
		expect(view.getByText("09:29:59")).toBeInTheDocument();
	});

	it("selects one schedule at a time and updates all its details", () => {
		const view = render(() => <TestWidget />);
		const official = view.getByRole("radio", { name: "Official schedule" });
		const solar = view.getByRole("radio", { name: "Solar estimate" });
		const graph = view.getByRole("img");
		const switchMarker = graph.querySelector("[data-switch=LIGHTS_START]");

		expect(official).toBeChecked();
		expect(solar).not.toBeChecked();
		fireEvent.click(solar);
		expect(solar).toBeChecked();
		expect(official).not.toBeChecked();
		expect(view.getAllByRole("img")).toHaveLength(1);
		expect(view.getByText("Lights expected on")).toBeInTheDocument();
		expect(view.getByText("≈ 09:30:00")).toBeInTheDocument();
		expect(view.container.querySelectorAll("[data-uncertainty-minutes]")).toHaveLength(2);
		expect(graph.querySelector("[data-switch=LIGHTS_START]")).toBe(switchMarker);
		fireEvent.click(official);
		expect(official).toBeChecked();
		expect(solar).not.toBeChecked();
		expect(view.getByText("Lights scheduled on")).toBeInTheDocument();
		expect(view.container.querySelectorAll("[data-uncertainty-minutes]")).toHaveLength(0);
	});

	it("disables the official option without a supported city", () => {
		uncertainty = 30;
		const view = render(() => <TestWidget />);
		const official = view.getByRole("radio", { name: "Official schedule" });
		expect(official).toBeDisabled();
		expect(official).not.toBeChecked();
		expect(view.getByRole("radio", { name: "Solar estimate" })).toBeChecked();
	});

	it("starts with the default source after remounting", () => {
		const view = render(() => <TestWidget />);
		fireEvent.click(view.getByRole("radio", { name: "Solar estimate" }));
		view.unmount();
		const remounted = render(() => <TestWidget />);
		expect(remounted.getByRole("radio", { name: "Official schedule" })).toBeChecked();
	});

	it("falls back to the solar graph when the city is cleared", () => {
		const [ city, setCity ] = createSignal<City>("MOSCOW");
		const view = render(() => <TestWidget city={city()} />);
		setCity("OTHER");
		expect(view.getByRole("radio", { name: "Official schedule" })).toBeDisabled();
		expect(view.getByRole("radio", { name: "Solar estimate" })).toBeChecked();
		expect(view.getByText("Lights expected on")).toBeInTheDocument();
		expect(view.getByRole("img")).toHaveAccessibleName(/Solar estimate/);
		setCity("MOSCOW");
		expect(view.getByRole("radio", { name: "Official schedule" })).toBeEnabled();
	});

	it.each([
		{
			date: new Date(2026, 9, 24, 20),
			label: "tomorrow",
			locale: "en"
		},
		{
			date: new Date(2026, 9, 25, 4),
			label: "yesterday",
			locale: "en"
		},
		{
			date: new Date(2026, 9, 24, 20),
			label: "завтра",
			locale: "ru"
		},
		{
			date: new Date(2026, 9, 25, 4),
			label: "вчера",
			locale: "ru"
		},
		{
			date: new Date(2026, 11, 31, 23),
			label: "tomorrow",
			locale: "en"
		},
		{
			date: new Date(2027, 0, 1, 4),
			label: "yesterday",
			locale: "en"
		}
	])("labels adjacent calendar days as $label in $locale", ({ date, label, locale }) => {
		language = locale;
		selected = () => date;
		const view = render(() => <TestWidget />);
		expect(view.getByText(label)).toBeInTheDocument();
	});

	it.each([ 30, 60 ])("shows ±%i minute bands, time ranges, and estimated state", (minutes) => {
		uncertainty = minutes;
		const view = render(() => <TestWidget />);
		expect(view.getByText("Lights expected on")).toBeInTheDocument();
		expect(view.container.querySelector("header")).not.toHaveTextContent("Other");
		expect(view.container.querySelectorAll(`[data-uncertainty-minutes="${minutes}"]`)).toHaveLength(2);
		expect(view.getByRole("img")).toHaveAccessibleDescription(new RegExp(`Shaded bands: ±${minutes} min at each switch`));
		expect(view.getByText(minutes === 30 ? "17:50 – 18:50" : "17:20 – 19:20")).toBeInTheDocument();
		expect(view.getByText("≈ 09:30:00")).toBeInTheDocument();
	});

	it("calls out uncertainty when the selected time is inside a switching window", () => {
		uncertainty = 30;
		selected = () => new Date(2026, 9, 24, 18, 10);
		const view = render(() => <TestWidget />);
		expect(view.getByText("Within the estimated switching window")).toBeInTheDocument();
	});

	it("resets the countdown and state when the selected time changes", () => {
		const [ date, setDate ] = createSignal(new Date(2026, 9, 24, 20, 40));
		selected = date;
		const view = render(() => <TestWidget />);
		vi.advanceTimersByTime(2000);
		setDate(new Date(2026, 9, 24, 18, 19, 59));
		expect(view.getByText("Lights scheduled off")).toBeInTheDocument();
		expect(view.getByText("00:00:01")).toBeInTheDocument();
		vi.advanceTimersByTime(5000);
		expect(view.getByText("00:00:00")).toBeInTheDocument();
	});

	it("preserves shared timer progress when switching schedules", () => {
		const [ getTimerTimestamp, setTimerTimestamp ] = createSignal(selected().getTime() + 3000);
		const view = render(() => <TestWidget getTimerTimestamp={getTimerTimestamp} />);

		expect(view.getByText("09:29:57")).toBeInTheDocument();
		setTimerTimestamp(selected().getTime() + 4000);
		expect(view.getByText("09:29:56")).toBeInTheDocument();
		fireEvent.click(view.getByRole("radio", { name: "Solar estimate" }));
		expect(view.getByText("≈ 09:29:56")).toBeInTheDocument();
	});

	it.each([ "CONTINUOUS_DAYLIGHT", "CONTINUOUS_DARKNESS", "UNAVAILABLE" ] as const)("does not invent times or show a countdown for %s", (value) => {
		status = value;
		const view = render(() => <TestWidget />);

		expect(view.queryByRole("img")).not.toBeInTheDocument();
		expect(view.queryByText("09:30:00")).not.toBeInTheDocument();
		expect(view.queryByText("Turn-on time")).not.toBeInTheDocument();

		if (value === "UNAVAILABLE") {
			expect(view.getByText("Unavailable")).toBeInTheDocument();
		}
	});
});
