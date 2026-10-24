import { render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { IlluminationState, LightsSchedule, LightsScheduleStatus } from "types";

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
		return { duration: null, LIGHTS_END: null, LIGHTS_START: null, source: uncertainty ? "SOLAR_ESTIMATE" : "SCHEDULE", status, uncertaintyMinutes: uncertainty };
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
		return { event: null, lights: schedule.status === "CONTINUOUS_DARKNESS", timestamp: null };
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

function TestWidget() {
	return (
		<CityLightsWidget
			city={uncertainty ? "OTHER" : "MOSCOW"}
			date={selected()}
			getScheduleForDate={getSchedule}
			schedule={getSchedule(selected())}
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

	it.each([
		{ date: new Date(2026, 9, 24, 20), label: "tomorrow", locale: "en" },
		{ date: new Date(2026, 9, 25, 4), label: "yesterday", locale: "en" },
		{ date: new Date(2026, 9, 24, 20), label: "завтра", locale: "ru" },
		{ date: new Date(2026, 9, 25, 4), label: "вчера", locale: "ru" },
		{ date: new Date(2026, 11, 31, 23), label: "tomorrow", locale: "en" },
		{ date: new Date(2027, 0, 1, 4), label: "yesterday", locale: "en" }
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
