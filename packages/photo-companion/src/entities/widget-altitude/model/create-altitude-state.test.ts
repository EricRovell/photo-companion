import { createRoot, createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { ALTITUDE_WIDGET_CONFIG } from "../config";
import { createAltitudeState } from "./create-altitude-state";

describe("altitude state updates", () => {
	it("reuses the daily curve while time changes and resamples for a new day or location", () => {
		createRoot(dispose => {
			try {
				const [ date, setDate ] = createSignal(new Date(2026, 9, 21, 12));
				const [ latitude, setLatitude ] = createSignal(30);

				const getPosition = vi.fn((input: {
					instant: DateLike;
					observer: { latitude: number }
				}) => ({
					apparentAltitude: input.observer.latitude * Math.sin(new Date(input.instant).getHours() * Math.PI / 12)
				}));

				const state = createAltitudeState({
					get date() { return date(); },
					entities: [ {
						getPosition,
						id: "sun",
						label: "Sun"
					} ],
					get latitude() { return latitude(); },
					longitude: 0,
					title: "Sun altitude"
				});

				const firstSeries = state.series();
				const firstRange = state.range();
				const firstX = state.cursorX();
				getPosition.mockClear();

				setDate(new Date(2026, 9, 21, 18));
				expect(state.series()).toBe(firstSeries);
				expect(state.range()).toBe(firstRange);
				expect(state.getAltitude("sun")).toBe(-30);
				expect(state.cursorX()).toBeGreaterThan(firstX);
				expect(getPosition).toHaveBeenCalledTimes(1);

				setLatitude(60);
				expect(state.series()).not.toBe(firstSeries);
				expect(state.getAltitude("sun")).toBe(-60);
				const relocatedSeries = state.series();

				setDate(new Date(2026, 9, 22, 0));
				expect(state.series()).not.toBe(relocatedSeries);
				expect(state.day().start).toBe(new Date(2026, 9, 22).getTime());
				expect(state.x(state.day().end)).toBe(ALTITUDE_WIDGET_CONFIG.plot.right);
			} finally {
				dispose();
			}
		});
	});

	it("rescales the selected curves without resampling their positions", () => {
		createRoot(dispose => {
			try {
				const [ selected, setSelected ] = createSignal<"moon" | "sun">();
				const getSunPosition = vi.fn(() => ({ apparentAltitude: 20 }));
				const getMoonPosition = vi.fn(() => ({ apparentAltitude: -30 }));

				const state = createAltitudeState({
					date: new Date(2026, 9, 21, 12),
					entities: [
						{
							getPosition: getSunPosition,
							id: "sun",
							label: "Sun"
						},
						{
							getPosition: getMoonPosition,
							id: "moon",
							label: "Moon"
						}
					],
					latitude: 0,
					longitude: 0,
					title: "Altitude"
				}, id => selected() === undefined || selected() === id);

				const plot = ALTITUDE_WIDGET_CONFIG.plot;
				const initialSeries = state.series();
				const initialPath = state.getPath("sun");

				expect(state.range()).toEqual({
					max: 25,
					min: -35
				});
				expect(state.horizon()).toBeCloseTo(plot.top + 100);
				expect(state.isHorizonVisible()).toBe(true);

				getSunPosition.mockClear();
				getMoonPosition.mockClear();

				setSelected("moon");
				expect(state.range()).toEqual({
					max: -25,
					min: -35
				});

				expect(state.horizon()).toBe(plot.top);
				expect(state.isHorizonVisible()).toBe(false);
				expect(state.y(-30)).toBe(plot.top + plot.height / 2);
				expect(state.getPath("sun")).not.toBe(initialPath);
				expect(state.series()).toBe(initialSeries);

				setSelected("sun");
				expect(state.range()).toEqual({
					max: 25,
					min: 15
				});

				expect(state.horizon()).toBe(plot.bottom);
				expect(state.isHorizonVisible()).toBe(false);
				expect(state.y(20)).toBe(plot.top + plot.height / 2);
				expect(getSunPosition).not.toHaveBeenCalled();
				expect(getMoonPosition).not.toHaveBeenCalled();
			} finally {
				dispose();
			}
		});
	});
});
