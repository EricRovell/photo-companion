import { getSunPosition } from "moon-sun-calc";
import { describe, expect, it } from "vitest";

import { getLightsAltitude, initLightsProvider } from "../src";

const BERLIN_LOCATION = { latitude: 52.52, longitude: 13.405 };
const LONGYEARBYEN = { latitude: 78.2232, longitude: 15.6469 };
const SAINT_PETERSBURG_LOCATION = { latitude: 59.9343, longitude: 30.3351 };

describe("Solar illumination estimate", () => {
	it("derives switch times from solar altitude crossings", () => {
		const provider = initLightsProvider("OTHER", BERLIN_LOCATION);
		const schedule = provider.getScheduleByDate(new Date(2026, 2, 20, 12));

		expect(schedule.status).toBe("SCHEDULED");
		expect(schedule.source).toBe("SOLAR_ESTIMATE");
		expect(schedule.uncertaintyMinutes).toBe(30);

		if (schedule.status !== "SCHEDULED") {
			throw new Error("Expected a scheduled solar estimate");
		}

		const startPosition = getSunPosition({
			instant: schedule.LIGHTS_START,
			observer: BERLIN_LOCATION
		});
		const endPosition = getSunPosition({
			instant: schedule.LIGHTS_END,
			observer: BERLIN_LOCATION
		});

		expect(Math.abs(
			startPosition.altitude - getLightsAltitude(
				new Date(2026, 2, 20),
				BERLIN_LOCATION.latitude,
				"LIGHTS_START"
			)
		)).toBeLessThan(0.1);

		expect(Math.abs(
			endPosition.altitude - getLightsAltitude(
				new Date(2026, 2, 20),
				BERLIN_LOCATION.latitude,
				"LIGHTS_END"
			)
		)).toBeLessThan(0.1);
		expect(schedule.duration).toBeGreaterThan(0);

		expect(provider.getEventsByDate(new Date(2026, 2, 20))).toEqual([
			expect.objectContaining({
				data: { city: "OTHER", source: "SOLAR_ESTIMATE" },
				name: "LIGHTS_START"
			}),
			expect.objectContaining({
				data: { city: "OTHER", source: "SOLAR_ESTIMATE" },
				name: "LIGHTS_END"
			})
		]);
	});

	it("adjusts the effective altitude over the year without a city lookup", () => {
		const august = new Date(2024, 7, 15);
		const november = new Date(2024, 10, 15);
		const augustStart = getLightsAltitude(
			august,
			SAINT_PETERSBURG_LOCATION.latitude,
			"LIGHTS_START"
		);
		const novemberStart = getLightsAltitude(
			november,
			SAINT_PETERSBURG_LOCATION.latitude,
			"LIGHTS_START"
		);

		expect(augustStart).toBeLessThan(-3);
		expect(novemberStart).toBeGreaterThan(-1.5);
		expect(novemberStart - augustStart).toBeGreaterThan(2);
	});

	it("uses the opposite seasonal phase in the Southern Hemisphere", () => {
		const northernSummer = getLightsAltitude(
			new Date(2026, 6, 1),
			55,
			"LIGHTS_START"
		);
		const southernSummer = getLightsAltitude(
			new Date(2026, 0, 1),
			-55,
			"LIGHTS_START"
		);

		expect(Math.abs(northernSummer - southernSummer)).toBeLessThan(0.05);
	});

	it("tapers the seasonal correction toward the equator", () => {
		const january = getLightsAltitude(new Date(2026, 0, 1), 0, "LIGHTS_START");
		const july = getLightsAltitude(new Date(2026, 6, 1), 0, "LIGHTS_START");

		expect(january).toBe(july);
	});

	it("reports the next estimated event and current lights state", () => {
		const provider = initLightsProvider("OTHER", BERLIN_LOCATION);
		const schedule = provider.getScheduleByDate(new Date(2026, 9, 15, 12));

		if (schedule.status !== "SCHEDULED") {
			throw new Error("Expected a scheduled solar estimate");
		}

		const daylight = new Date((schedule.LIGHTS_END + schedule.LIGHTS_START) / 2);
		const afterSwitchOn = new Date(schedule.LIGHTS_START + 60 * 60 * 1000);

		expect(provider.getStateByDate(daylight)).toEqual({
			event: "LIGHTS_START",
			lights: false,
			timestamp: schedule.LIGHTS_START
		});
		expect(provider.getStateByDate(afterSwitchOn)).toEqual({
			event: "LIGHTS_END",
			lights: true,
			timestamp: expect.any(Number)
		});
	});

	it("handles continuous daylight without invalid timestamps", () => {
		const provider = initLightsProvider("OTHER", LONGYEARBYEN);
		const date = new Date(2026, 5, 21, 12);

		expect(provider.getScheduleByDate(date)).toEqual({
			duration: null,
			LIGHTS_END: null,
			LIGHTS_START: null,
			source: "SOLAR_ESTIMATE",
			status: "CONTINUOUS_DAYLIGHT",
			uncertaintyMinutes: 60
		});
		expect(provider.getStateByDate(date)).toEqual({
			event: null,
			lights: false,
			timestamp: null
		});
		expect(provider.getEventsByDate(date)).toEqual([]);
	});

	it("handles continuous darkness without invalid timestamps", () => {
		const provider = initLightsProvider("OTHER", LONGYEARBYEN);
		const date = new Date(2026, 11, 21, 12);

		expect(provider.getScheduleByDate(date).status).toBe("CONTINUOUS_DARKNESS");
		expect(provider.getStateByDate(date)).toEqual({
			event: null,
			lights: true,
			timestamp: null
		});
		expect(provider.getEventsByDate(date)).toEqual([]);
	});

	it("returns an unavailable estimate when coordinates are missing", () => {
		const provider = initLightsProvider("OTHER");

		expect(provider.getScheduleByDate().status).toBe("UNAVAILABLE");
		expect(provider.getStateByDate()).toEqual({
			event: null,
			lights: false,
			timestamp: null
		});
	});
});
