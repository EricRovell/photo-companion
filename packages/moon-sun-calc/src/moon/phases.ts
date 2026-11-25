import {
	angularDifference,
	DAY_MS,
	MIN_SUPPORTED_YEAR,
	normalizeDegrees,
	toTimestamp,
	validateIntegerRange
} from "../shared";
import { getSunGeocentricCoords } from "../sun/ephemeris";
import {
	MAX_MOON_AGE_SEARCH_DURATION,
	MAX_PHASE_COUNT,
	MAX_PHASE_SEARCH_DURATION,
	MIN_PHASE_COUNT,
	PHASE_SEARCH_STEP,
	PRINCIPAL_MOON_PHASES
} from "./consts";
import { moonGeocentric } from "./ephemeris";

import type { DateLike, Millisecond, UtcInterval } from "../types";
import type { MoonPhaseEvent, RefinePhaseInput } from "./types";

function elongation(timestamp: Millisecond): number {
	return normalizeDegrees(
		moonGeocentric(timestamp).eclipticLongitude - getSunGeocentricCoords(timestamp).eclipticLongitude
	);
}

function refinePhase({ left, right, target }: RefinePhaseInput): Millisecond {
	let leftValue = angularDifference(elongation(left), target);

	for (let index = 0; index < 50 && right - left > 100; index += 1) {
		const middle = (left + right) / 2;
		const middleValue = angularDifference(elongation(middle), target);

		if (Math.sign(leftValue) === Math.sign(middleValue)) {
			left = middle;
			leftValue = middleValue;
		} else {
			right = middle;
		}
	}

	return (left + right) / 2;
}

/** Returns the elapsed days since the previous geocentric new Moon. */
export function getMoonAge(input: DateLike): number {
	const timestamp = toTimestamp(input);
	let right = timestamp;
	let rightElongation = elongation(right);

	for (
		let left = right - PHASE_SEARCH_STEP;
		timestamp - left <= MAX_MOON_AGE_SEARCH_DURATION;
		left -= PHASE_SEARCH_STEP
	) {
		const leftElongation = elongation(left);

		if (leftElongation > 180 && rightElongation < 180) {
			const newMoon = refinePhase({
				left,
				right,
				target: 0
			});

			return (timestamp - newMoon) / DAY_MS;
		}

		right = left;
		rightElongation = leftElongation;
	}

	throw new Error("Moon age search failed to converge");
}

function* searchMoonPhases(start: Millisecond, end: Millisecond): Generator<MoonPhaseEvent> {
	let previousTime = start;
	let previous = elongation(previousTime);
	let unwrapped = previous;
	let nextTarget = Math.floor(unwrapped / 90 + 1) * 90;

	for (
		let time = Math.min(start + PHASE_SEARCH_STEP, end);
		time > previousTime;
		time = Math.min(time + PHASE_SEARCH_STEP, end)
	) {
		toTimestamp(time, "phase search instant");
		const current = elongation(time);
		unwrapped += angularDifference(current, previous);

		while (unwrapped >= nextTarget) {
			const target = normalizeDegrees(nextTarget);
			const refined = refinePhase({
				left: previousTime,
				right: time,
				target
			});
			yield {
				phase: PRINCIPAL_MOON_PHASES[(Math.round(nextTarget / 90) % 4 + 4) % 4],
				time: new Date(refined)
			};
			nextTarget += 90;
		}

		previous = current;
		previousTime = time;
	}
}

/** Returns the principal phases within a half-open UTC interval. */
export function findMoonPhaseEvents(interval: UtcInterval): MoonPhaseEvent[] {
	const start = toTimestamp(interval.start, "interval.start");
	const lastInstant = toTimestamp(new Date(interval.end).getTime() - 1, "interval.end");

	if (lastInstant < start) {
		throw new RangeError("interval.end must be later than interval.start");
	}

	const firstSample = Math.max(start - 1, Date.UTC(MIN_SUPPORTED_YEAR, 0, 1));

	return Array.from(searchMoonPhases(firstSample, lastInstant))
		.filter(event => event.time.getTime() >= start);
}

/** Returns the next principal phases strictly after the supplied UTC instant. */
export function getNextMoonPhases(input: DateLike, count = 4): MoonPhaseEvent[] {
	const start = toTimestamp(input);
	const phaseCount = validateIntegerRange({
		label: "Count",
		maximum: MAX_PHASE_COUNT,
		minimum: MIN_PHASE_COUNT,
		value: count
	});
	const events: MoonPhaseEvent[] = [];

	for (const event of searchMoonPhases(start + 1, start + MAX_PHASE_SEARCH_DURATION)) {
		events.push(event);

		if (events.length === phaseCount) {
			return events;
		}
	}

	throw new Error("phase search failed to converge");
}
