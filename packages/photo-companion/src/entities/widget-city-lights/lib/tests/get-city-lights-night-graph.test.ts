import { getLightsNight } from "lights-schedule";
import { describe, expect, it } from "vitest";

import type { ScheduledLightsSchedule } from "types";

import { getCityLightsNightGraph } from "../get-city-lights-night-graph";

function getSchedule(date: Date): ScheduledLightsSchedule {
	const start = new Date(date);
	start.setHours(18, 20, 0, 0);
	const end = new Date(date);
	end.setHours(6, 10, 0, 0);
	return {
		duration: (11 * 60 + 50) * 60_000,
		LIGHTS_END: end.getTime(),
		LIGHTS_START: start.getTime(),
		source: "SCHEDULE",
		status: "SCHEDULED",
		uncertaintyMinutes: 0
	};
}

describe("getCityLightsNightGraph", () => {
	it("projects the night onto a noon-to-noon scale with a selected-time marker and calendar ticks", () => {
		const date = new Date(2026, 9, 25, 4);
		const night = getLightsNight(date, getSchedule);
		const graph = getCityLightsNightGraph(night, date);
		expect(graph.position).toBeCloseTo(100 * 16 / 24);
		expect(graph.events[0].position).toBeCloseTo(100 * (6 + 20 / 60) / 24);
		expect(graph.events[1].position).toBeCloseTo(100 * (18 + 10 / 60) / 24);
		expect(graph.ticks.map(tick => [ tick.time.getHours(), tick.position ])).toEqual([
			[ 12, 0 ], [ 18, 25 ], [ 0, 50 ], [ 6, 75 ], [ 12, 100 ]
		]);
	});

	it("clips estimate bands while retaining windows whose switch is outside the graph", () => {
		const date = new Date(2026, 9, 24, 20);
		const night = getLightsNight(date, date => {
			const start = new Date(date);
			start.setHours(12, 10, 0, 0);
			const end = new Date(date);
			end.setHours(11, 40, 0, 0);
			return { ...getSchedule(date), LIGHTS_END: end.getTime(), LIGHTS_START: start.getTime(), source: "SOLAR_ESTIMATE", uncertaintyMinutes: 60 };
		});
		const graph = getCityLightsNightGraph(night, date);
		const on = graph.events.find(event => event.name === "LIGHTS_START");
		expect(on?.windowStart).toBe(0);
		expect(on?.windowEnd).toBeCloseTo(100 * 70 / (24 * 60));
		const window = graph.windows.find(event => event.timestamp === new Date(2026, 9, 24, 11, 40).getTime());
		expect(window?.windowStart).toBe(0);
		expect(window?.windowEnd).toBeCloseTo(100 * 40 / (24 * 60));
		expect(graph.events.some(event => event.timestamp === window?.timestamp)).toBe(false);
	});

	it("keeps overlapping uncertainty bands from producing a negative core width", () => {
		const date = new Date(2026, 9, 24, 23, 55);
		const night = getLightsNight(date, date => {
			const start = new Date(date);
			start.setHours(23, 50, 0, 0);
			const end = new Date(date);
			end.setHours(0, 10, 0, 0);
			return { ...getSchedule(date), LIGHTS_END: end.getTime(), LIGHTS_START: start.getTime(), source: "SOLAR_ESTIMATE", uncertaintyMinutes: 60 };
		});
		const graph = getCityLightsNightGraph(night, date);
		expect(graph.intervals).toHaveLength(1);
		expect(graph.intervals[0].innerEnd).toBe(graph.intervals[0].innerStart);
	});
});
