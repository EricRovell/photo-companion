import { describe, expect, it } from "vitest";

import { interpolateAltitudePoints } from "./interpolate-altitude-points";
import { sampleAltitude } from "./sample-altitude";

const HOUR = 60 * 60 * 1000;

describe("altitude curve interpolation", () => {
	it.each([ [ 24, 23 ], [ 23, 24 ], [ 24, 25 ], [ 25, 24 ] ])(
		"matches the whole curve across a %s-hour to %s-hour day change",
		(fromHours, toHours) => {
			const from = sampleAltitude(0, fromHours * HOUR, time => time / (fromHours * HOUR) * 40).points;
			const start = 48 * HOUR;
			const end = start + toHours * HOUR;
			const to = sampleAltitude(start, end, time => 20 + (time - start) / (toHours * HOUR) * 60).points;
			const points = interpolateAltitudePoints(from, to, 0.5);

			expect(points).toHaveLength(to.length);
			expect(points[0]).toEqual({
				altitude: 10,
				timestamp: start 
			});
			expect(points[(points.length - 1) / 2].altitude).toBeCloseTo(35);
			expect(points[points.length - 1]).toEqual({
				altitude: 60,
				timestamp: end 
			});
			expect(points.every(point => Number.isFinite(point.altitude))).toBe(true);
		}
	);
});
