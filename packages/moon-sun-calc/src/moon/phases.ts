import {
	angularDifference,
	normalizeDegrees,
	toTimestamp,
	validateIntegerRange
} from "../shared";
import { getSunGeocentricCoords } from "../sun/ephemeris";
import {
	MAX_PHASE_COUNT,
	MAX_PHASE_SEARCH_DURATION,
	MIN_PHASE_COUNT,
	PHASE_SEARCH_STEP,
	PRINCIPAL_MOON_PHASES
} from "./consts";
import { moonGeocentric } from "./ephemeris";

import type { DateLike, Millisecond } from "../types";
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
	let previousTime = start + 1;
	let previous = elongation(previousTime);
	let unwrapped = previous;
	let nextTarget = Math.floor(unwrapped / 90 + 1) * 90;

	for (let time = previousTime + PHASE_SEARCH_STEP; events.length < phaseCount; time += PHASE_SEARCH_STEP) {
		toTimestamp(time, "phase search instant");
		const current = elongation(time);
		unwrapped += angularDifference(current, previous);

		while (unwrapped >= nextTarget && events.length < phaseCount) {
			const target = normalizeDegrees(nextTarget);
			const refined = refinePhase({ left: previousTime, right: time, target });
			events.push({
				phase: PRINCIPAL_MOON_PHASES[(Math.round(nextTarget / 90) % 4 + 4) % 4],
				time: new Date(refined)
			});
			nextTarget += 90;
		}

		previous = current;
		previousTime = time;

		if (time - start > MAX_PHASE_SEARCH_DURATION) {
			throw new Error("phase search failed to converge");
		}
	}

	return events;
}
