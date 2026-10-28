import { createRoot, createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ALTITUDE_WIDGET_CONFIG } from "../config";
import { createAltitudeState } from "./create-altitude-state";
import { createTweenedAltitudeChart } from "./create-tweened-altitude-chart";

import type { AltitudeChartFrame } from "../types";

const DURATION = ALTITUDE_WIDGET_CONFIG.animation.transitionDuration;
const frames = new Map<number, FrameRequestCallback>();
const disposers: VoidFn[] = [];
let now = 0;
let frameId = 0;
let media: { matches: boolean } & EventTarget;

beforeEach(() => {
	now = 0;
	frameId = 0;
	frames.clear();
	media = Object.assign(new EventTarget(), { matches: false });
	vi.stubGlobal("matchMedia", vi.fn(() => media));
	vi.spyOn(performance, "now").mockImplementation(() => now);
	vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
		frames.set(++frameId, callback);
		return frameId;
	}));
	vi.stubGlobal("cancelAnimationFrame", vi.fn((id: number) => frames.delete(id)));
});

afterEach(() => {
	disposers.splice(0).forEach(dispose => dispose());
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

function advanceFrame(elapsed: number) {
	now += elapsed;
	const callbacks = Array.from(frames.values());
	frames.clear();
	callbacks.forEach(callback => callback(now));
}

function frame(day: number, offset: number): AltitudeChartFrame {
	const start = new Date(2026, 9, day).getTime();
	const end = new Date(2026, 9, day + 1).getTime();

	return {
		current: new Map([ [ "sun", offset ] ]),
		cursorX: 100 + offset,
		day: {
			end,
			start 
		},
		range: {
			max: offset + 25,
			min: offset - 25 
		},
		series: new Map([ [ "sun", [
			{
				altitude: offset - 20,
				timestamp: start 
			},
			{
				altitude: offset,
				timestamp: (start + end) / 2 
			},
			{
				altitude: offset + 20,
				timestamp: end 
			}
		] ] ])
	};
}

function setup(initial: AltitudeChartFrame) {
	return createRoot(dispose => {
		disposers.push(dispose);
		const [ target, setTarget ] = createSignal(initial);

		return {
			chart: createTweenedAltitudeChart(target),
			dispose,
			setTarget
		};
	});
}

describe("altitude day transitions", () => {
	it("renders immediately on mount and for changes within the same day", () => {
		const initial = frame(21, 0);
		const state = setup(initial);
		const next = frame(21, 20);

		expect(state.chart()).toBe(initial);
		state.setTarget(next);
		expect(state.chart()).toBe(next);
		expect(requestAnimationFrame).not.toHaveBeenCalled();
	});

	it("tweens the curve, range and cursor together when the day changes", () => {
		const initial = frame(21, 0);
		const state = setup(initial);
		const next = frame(22, 40);

		state.setTarget(next);
		expect(state.chart()).toBe(initial);
		advanceFrame(DURATION / 2);

		expect(state.chart().current.get("sun")).toBeCloseTo(20);
		expect(state.chart().cursorX).toBeCloseTo(120);
		expect(state.chart().range).toEqual({
			max: 45,
			min: -5 
		});
		expect(state.chart().series.get("sun")?.map(point => point.altitude)).toEqual([ 0, 20, 40 ]);
		advanceFrame(DURATION / 2);
		expect(state.chart()).toBe(next);
		expect(frames.size).toBe(0);
	});

	it("retargets from the displayed curve during rapid and backward date changes", () => {
		const state = setup(frame(21, 0));
		state.setTarget(frame(23, 40));
		advanceFrame(DURATION / 2);
		const displayed = state.chart();
		const next = frame(20, -20);

		state.setTarget(next);
		expect(state.chart()).toBe(displayed);
		expect(frames.size).toBe(1);
		advanceFrame(DURATION / 2);
		expect(state.chart().current.get("sun")).toBeCloseTo(0);
		advanceFrame(DURATION / 2);
		expect(state.chart()).toBe(next);
	});

	it("keeps same-day changes immediate during an active transition", () => {
		const state = setup(frame(21, 0));
		state.setTarget(frame(22, 40));
		advanceFrame(DURATION / 2);
		const next = frame(22, 45);

		state.setTarget(next);
		expect(state.chart()).toBe(next);
		advanceFrame(DURATION);
		expect(state.chart()).toBe(next);
	});

	it("skips animation when reduced motion is enabled", () => {
		media.matches = true;
		const state = setup(frame(21, 0));
		const next = frame(22, 40);

		state.setTarget(next);
		expect(state.chart()).toBe(next);
		expect(requestAnimationFrame).not.toHaveBeenCalled();
	});

	it("finishes an active transition when reduced motion is enabled", () => {
		const state = setup(frame(21, 0));
		const next = frame(22, 40);
		state.setTarget(next);
		advanceFrame(DURATION / 2);

		media.matches = true;
		media.dispatchEvent(new Event("change"));
		expect(state.chart()).toBe(next);
		expect(frames.size).toBe(0);
	});

	it("cancels the pending animation frame when disposed", () => {
		const state = setup(frame(21, 0));
		state.setTarget(frame(22, 40));
		expect(frames.size).toBe(1);
		state.dispose();
		expect(frames.size).toBe(0);
	});

	it("animates rendered geometry while keeping readouts current and reusing daily samples", () => {
		const getPosition = vi.fn(({ instant }: { instant: DateLike }) => {
			const date = new Date(instant);
			const amplitude = date.getDate() === 21 ? 20 : 40;

			return { apparentAltitude: amplitude * Math.sin(date.getHours() * Math.PI / 12) + (date.getDate() - 21) * 10 };
		});
		const state = createRoot(dispose => {
			disposers.push(dispose);
			const [ date, setDate ] = createSignal(new Date(2026, 9, 21, 12));

			return {
				...createAltitudeState({
					get date() { return date(); },
					entities: [ {
						getPosition,
						id: "sun",
						label: "Sun" 
					} ],
					latitude: 0,
					longitude: 0,
					title: "Altitude"
				}),
				setDate
			};
		});
		const initialPath = state.getPath("sun");

		state.setDate(new Date(2026, 9, 22, 18));
		const positionCalls = getPosition.mock.calls.length;
		expect(state.getAltitude("sun")).toBeCloseTo(-30);
		expect(state.getMarkerAltitude("sun")).toBeCloseTo(0);
		expect(state.getPath("sun")).toBe(initialPath);
		advanceFrame(DURATION / 2);
		const middlePath = state.getPath("sun");

		expect(state.getMarkerAltitude("sun")).toBeCloseTo(-15);
		expect(state.range()).toEqual({
			max: 40,
			min: -30 
		});
		expect(middlePath).not.toBe(initialPath);
		advanceFrame(DURATION / 2);
		expect(state.getMarkerAltitude("sun")).toBeCloseTo(-30);
		expect(state.getPath("sun")).not.toBe(middlePath);
		expect(state.cursorX()).toBe(ALTITUDE_WIDGET_CONFIG.plot.left + ALTITUDE_WIDGET_CONFIG.plot.width * 0.75);
		expect(getPosition).toHaveBeenCalledTimes(positionCalls);
	});
});
