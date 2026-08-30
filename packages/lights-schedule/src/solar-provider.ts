import { findSunAltitudeCrossings, getSunPosition } from "moon-sun-calc";
import { calcDuration, getDayStart, shiftDate } from "utils/date";
import { clamp } from "utils/math";
import { isLatitude, isLongitude, isValidDate } from "utils/validators";

import type { IlluminationState, LightsEvent, LightsEventName, LightsSchedule } from "types";

import { CALIBRATION_LATITUDE_CENTER, CALIBRATION_LATITUDE_RADIUS, MILLISECONDS_PER_DAY, MILLISECONDS_PER_MINUTE, NEXT_EVENT_SEARCH_DAYS } from "./const";

import type { LightsProvider, SolarAltitudeModel, SolarLightsLocation } from "./types";

/**
 * Two-harmonic annual fits of the effective solar altitude in the bundled
 * Moscow and Saint Petersburg schedules. Coefficients are ordered as:
 * constant, sin(year), cos(year), sin(2 * year), cos(2 * year).
 */
const SOLAR_ALTITUDE_MODELS: Record<LightsEventName, SolarAltitudeModel> = {
	LIGHTS_END: {
		base: [ -3.440684, -0.104149, 1.484163, 0.145806, -0.448 ],
		latitudeAdjustment: [ 0.550284, -0.326865, 0.240311, -0.168399, 0.231038 ]
	},
	LIGHTS_START: {
		base: [ -2.521152, -0.04104, 0.881416, -0.078095, -0.362265 ],
		latitudeAdjustment: [ 0.006219, -0.335588, 0.654017, -0.04651, 0.096258 ]
	}
};

function getYearAngle(date: Date, latitude: number): number {
	const year = date.getFullYear();
	const yearStart = Date.UTC(year, 0, 1);
	const nextYearStart = Date.UTC(year + 1, 0, 1);
	const day = Date.UTC(year, date.getMonth(), date.getDate()) - yearStart;
	const hemisphereOffset = latitude < 0 ? Math.PI : 0;

	return 2 * Math.PI * (day + MILLISECONDS_PER_DAY / 2)
		/ (nextYearStart - yearStart)
		+ hemisphereOffset;
}

/**
 * Returns the season- and latitude-adjusted solar altitude at which a lights
 * event is estimated to happen. The latitude adjustment is clamped to the
 * calibration range to avoid uncontrolled geographic extrapolation.
 */
export function getLightsAltitude(
	date: Date,
	latitude: number,
	event: LightsEventName
): number {
	const angle = getYearAngle(date, latitude);
	const absoluteLatitude = Math.abs(latitude);

	const seasonalScale = clamp(
		absoluteLatitude / (CALIBRATION_LATITUDE_CENTER - CALIBRATION_LATITUDE_RADIUS),
		0,
		1
	);

	const features = [
		1,
		seasonalScale * Math.sin(angle),
		seasonalScale * Math.cos(angle),
		seasonalScale * Math.sin(2 * angle),
		seasonalScale * Math.cos(2 * angle)
	];

	const latitudeFactor = clamp(
		(absoluteLatitude - CALIBRATION_LATITUDE_CENTER) / CALIBRATION_LATITUDE_RADIUS,
		-1,
		1
	);

	const model = SOLAR_ALTITUDE_MODELS[event];

	return features.reduce((altitude, feature, index) => (
		altitude
		+ feature * (
			model.base[index]
			+ latitudeFactor * model.latitudeAdjustment[index]
		)
	), 0);
}

export function isSolarLightsLocation(value: SolarLightsLocation | undefined): value is SolarLightsLocation {
	return Boolean(
		value
		&& isLatitude(value.latitude)
		&& isLongitude(value.longitude)
	);
}

function getUncertaintyMinutes(latitude: number): number {
	return Math.abs(latitude) >= 63 ? 60 : 30;
}

function roundToMinute(timestamp: number): number {
	return Math.round(timestamp / MILLISECONDS_PER_MINUTE) * MILLISECONDS_PER_MINUTE;
}

export function initUnavailableSolarLightsProvider(): LightsProvider {
	const schedule: LightsSchedule = {
		duration: null,
		LIGHTS_END: null,
		LIGHTS_START: null,
		source: "SOLAR_ESTIMATE",
		status: "UNAVAILABLE",
		uncertaintyMinutes: 0
	};

	return {
		city: "OTHER",
		getEventsByDate: () => [],
		getScheduleByDate: () => schedule,
		getStateByDate: () => ({ event: null, lights: false, timestamp: null }),
		source: "SOLAR_ESTIMATE",
		year: null
	};
}

export function initSolarLightsProvider(location: SolarLightsLocation): LightsProvider {
	if (!isSolarLightsLocation(location)) {
		throw new RangeError("A valid latitude and longitude are required for a solar lights estimate");
	}

	const city = "OTHER";
	const observer = { ...location };
	const source = "SOLAR_ESTIMATE";
	const uncertaintyMinutes = getUncertaintyMinutes(location.latitude);

	function getUnavailableSchedule(): LightsSchedule {
		return {
			duration: null,
			LIGHTS_END: null,
			LIGHTS_START: null,
			source,
			status: "UNAVAILABLE",
			uncertaintyMinutes
		};
	}

	function getScheduleByDate(input = new Date()): LightsSchedule {
		if (!isValidDate(input)) {
			return getUnavailableSchedule();
		}

		const start = getDayStart(input);
		const end = shiftDate(start, "day", 1);
		const interval = { end, start };
		const lightsEndAltitude = getLightsAltitude(input, location.latitude, "LIGHTS_END");
		const lightsStartAltitude = getLightsAltitude(input, location.latitude, "LIGHTS_START");

		const lightsStart = findSunAltitudeCrossings({
			altitude: lightsStartAltitude,
			interval,
			observer
		}).find(crossing => crossing.direction === "setting");
		const lightsEnd = findSunAltitudeCrossings({
			altitude: lightsEndAltitude,
			interval,
			observer
		}).find(crossing => crossing.direction === "rising");

		if (lightsStart && lightsEnd) {
			const LIGHTS_START = roundToMinute(lightsStart.time.getTime());
			const LIGHTS_END = roundToMinute(lightsEnd.time.getTime());

			return {
				duration: calcDuration(LIGHTS_START, LIGHTS_END),
				LIGHTS_END,
				LIGHTS_START,
				source,
				status: "SCHEDULED",
				uncertaintyMinutes
			};
		}

		// If even the day's highest sampled Sun is below the morning switch-off
		// threshold, illumination remains on. All other no-crossing cases are
		// continuous daylight for the purposes of this estimate.
		let maximumAltitude = -90;
		const step = 30 * MILLISECONDS_PER_MINUTE;

		for (let timestamp = start; timestamp < end.getTime(); timestamp += step) {
			maximumAltitude = Math.max(
				maximumAltitude,
				getSunPosition({ instant: timestamp, observer }).altitude
			);
		}

		return {
			duration: null,
			LIGHTS_END: null,
			LIGHTS_START: null,
			source,
			status: maximumAltitude < lightsEndAltitude
				? "CONTINUOUS_DARKNESS"
				: "CONTINUOUS_DAYLIGHT",
			uncertaintyMinutes
		};
	}

	function findNextLightsEnd(input: Date): null | number {
		let date = shiftDate(input, "day", 1);

		for (let day = 0; day < NEXT_EVENT_SEARCH_DAYS; day++) {
			const schedule = getScheduleByDate(date);

			if (schedule.status === "SCHEDULED") {
				return schedule.LIGHTS_END;
			}

			date = shiftDate(date, "day", 1);
		}

		return null;
	}

	function getStateByDate(input = new Date()): IlluminationState {
		const schedule = getScheduleByDate(input);

		if (schedule.status === "CONTINUOUS_DARKNESS") {
			return { event: null, lights: true, timestamp: null };
		}

		if (schedule.status !== "SCHEDULED") {
			return { event: null, lights: false, timestamp: null };
		}

		const timestamp = input.getTime();

		if (timestamp < schedule.LIGHTS_END) {
			return { event: "LIGHTS_END", lights: true, timestamp: schedule.LIGHTS_END };
		}

		if (timestamp <= schedule.LIGHTS_START) {
			return { event: "LIGHTS_START", lights: false, timestamp: schedule.LIGHTS_START };
		}

		return {
			event: "LIGHTS_END",
			lights: true,
			timestamp: findNextLightsEnd(input)
		};
	}

	function getEventsByDate(input = new Date()): LightsEvent[] {
		const schedule = getScheduleByDate(input);

		if (schedule.status !== "SCHEDULED") {
			return [];
		}

		return [
			{
				data: { city, source },
				name: "LIGHTS_START",
				timestamp: schedule.LIGHTS_START,
				type: "LIGHTS"
			},
			{
				data: { city, source },
				name: "LIGHTS_END",
				timestamp: schedule.LIGHTS_END,
				type: "LIGHTS"
			}
		];
	}

	return {
		city,
		getEventsByDate,
		getScheduleByDate,
		getStateByDate,
		source,
		year: null
	};
}
