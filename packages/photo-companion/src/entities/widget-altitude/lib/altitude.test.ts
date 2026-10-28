import { afterEach, describe, expect, it, vi } from "vitest";

import { ALTITUDE_WIDGET_CONFIG } from "../config";
import { altitudeX, altitudeY } from "./altitude-coordinates";
import { createAltitudePath } from "./create-altitude-path";
import { getAltitudeRange } from "./get-altitude-range";
import { getAltitudeTicks } from "./get-altitude-ticks";
import { getDayBounds } from "./get-day-bounds";
import { getHourTicks } from "./get-hour-ticks";
import { sampleAltitude } from "./sample-altitude";

const HOUR = 60 * 60 * 1000;
const PLOT = ALTITUDE_WIDGET_CONFIG.plot;

afterEach(() => vi.unstubAllEnvs());

describe("altitude day geometry", () => {
	it.each([
		[ "2026-03-08T12:00:00-04:00", 23 ],
		[ "2026-11-01T12:00:00-05:00", 25 ],
		[ "2026-10-21T12:00:00-04:00", 24 ]
	])("uses both local midnights and civil-hour ticks on %s", (date, hours) => {
		vi.stubEnv("TZ", "America/New_York");
		const { end, start } = getDayBounds(new Date(date));
		const ticks = getHourTicks(start);

		expect(end - start).toBe(hours * HOUR);
		expect(ticks[0].timestamp).toBe(start);
		expect(ticks[6].timestamp).toBe(end);
		expect(ticks.slice(0, -1).map(tick => new Date(tick.timestamp).getHours())).toEqual([ 0, 4, 8, 12, 16, 20 ]);
		expect(altitudeX(end, start, end)).toBe(PLOT.right);
	});

	it("projects an asymmetric altitude range and includes the last midnight in the path", () => {
		const range = {
			max: 50,
			min: -30
		};

		expect(altitudeY(50, range)).toBe(PLOT.top);
		expect(altitudeY(0, range)).toBe(PLOT.top + 150);
		expect(altitudeY(-30, range)).toBe(PLOT.bottom);
		expect(createAltitudePath([
			{
				altitude: -30,
				timestamp: 0
			},
			{
				altitude: 50,
				timestamp: 24 * HOUR
			}
		], 0, 24 * HOUR, range)).toBe(`M ${PLOT.left}.00 ${PLOT.bottom}.00 L ${PLOT.right}.00 ${PLOT.top}.00`);
	});
});

describe("altitude scale", () => {
	it.each([
		{
			altitudes: [ -12.5, 44.25 ],
			expected: {
				max: 49.25,
				min: -17.5
			}
		},
		{
			altitudes: [ 20, 40 ],
			expected: {
				max: 45,
				min: 15
			}
		},
		{
			altitudes: [ -40, -20 ],
			expected: {
				max: -15,
				min: -45
			}
		},
		{
			altitudes: [ 30, 30 ],
			expected: {
				max: 35,
				min: 25
			}
		},
		{
			altitudes: [ -90, 90 ],
			expected: {
				max: 95,
				min: -95
			}
		},
		{
			altitudes: [],
			expected: {
				max: 5,
				min: -5
			}
		}
	])("pads the daily extrema by 5° for $altitudes", ({ altitudes, expected }) => {
		const range = getAltitudeRange(altitudes.map((altitude, timestamp) => ({
			altitude,
			timestamp
		})));
		const ticks = getAltitudeTicks(range);

		expect(range).toEqual(expected);
		expect(ticks.length).toBeGreaterThan(0);
		for (const tick of ticks) {
			expect(tick).toBeGreaterThanOrEqual(range.min);
			expect(tick).toBeLessThanOrEqual(range.max);
		}
		if (range.min <= 0 && range.max >= 0) {
			expect(ticks).toContain(0);
		}
	});
});

describe("daily altitude peak", () => {
	it("refines a peak between samples even when the body stays below the horizon", () => {
		const peakTime = 12 * HOUR + 123000;
		const { peak, points } = sampleAltitude(0, 24 * HOUR, time => -10 - ((time - peakTime) / HOUR) ** 2);

		expect(peak.altitude).toBeCloseTo(-10, 6);
		expect(Math.abs(peak.timestamp - peakTime)).toBeLessThan(100);
		expect(points[0].timestamp).toBe(0);
		expect(points[points.length - 1].timestamp).toBe(24 * HOUR);
	});

	it.each([ -1, 1 ])("keeps a monotonic day's maximum inside the selected day (%s)", direction => {
		const { peak } = sampleAltitude(0, 24 * HOUR, time => direction * time / HOUR);
		expect(peak.timestamp).toBe(direction === 1 ? 24 * HOUR - 1 : 0);
	});
});
