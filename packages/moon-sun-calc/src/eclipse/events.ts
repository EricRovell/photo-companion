import { isNullable } from "utils/validators";

import { getNextMoonPhases } from "../moon/phases";
import {
	DAY_MS,
	MAX_SUPPORTED_YEAR,
	MIN_SUPPORTED_YEAR,
	refineMinimum,
	refineRoot,
	toTimestamp,
	validateObserver
} from "../shared";
import {
	CANDIDATE_WINDOW,
	PEAK_COMPARISON_TOLERANCE,
	ROOT_TOLERANCE,
	SEARCH_MARGIN,
	SEARCH_STEP
} from "./consts";
import { calculateSolarEclipseState } from "./state";

import type { Millisecond, Observer } from "../types";
import type {
	LocalSolarEclipse,
	NearbySolarEclipseInput,
	SolarEclipseContact,
	SolarEclipseInput,
	SolarEclipseSearchInput,
	SolarEclipseVisibility
} from "./types";

const MIN_TIMESTAMP = Date.UTC(MIN_SUPPORTED_YEAR, 0, 1);
const MAX_TIMESTAMP = Date.UTC(MAX_SUPPORTED_YEAR, 11, 31, 23, 59, 59, 999);

function nextNewMoon(timestamp: Millisecond): Millisecond | null {
	try {
		return getNextMoonPhases(timestamp, 4)
			.find(event => event.phase === "NEW_MOON")?.time.getTime() ?? null;
	} catch (error) {
		if (error instanceof RangeError) {
			return null;
		}

		throw error;
	}
}

function previousNewMoon(timestamp: Millisecond): Millisecond | null {
	let end = timestamp;

	while (end > MIN_TIMESTAMP) {
		const start = Math.max(MIN_TIMESTAMP, end - 40 * DAY_MS);

		try {
			const candidates = getNextMoonPhases(start, 4)
				.filter(event => event.phase === "NEW_MOON" && event.time.getTime() < timestamp);

			if (candidates.length > 0) {
				return candidates[candidates.length - 1].time.getTime();
			}
		} catch (error) {
			if (!(error instanceof RangeError)) {
				throw error;
			}
		}

		if (start === MIN_TIMESTAMP) {
			break;
		}

		end = start;
	}

	return null;
}

function contactValue(timestamp: Millisecond, observer: Required<Observer>): number {
	const state = calculateSolarEclipseState(timestamp, observer);

	return state.separation - state.sun.angularRadius - state.moon.angularRadius;
}

function findContactBracket(
	fn: (timestamp: Millisecond) => number,
	peak: Millisecond,
	boundary: Millisecond,
	direction: -1 | 1
): null | readonly [Millisecond, Millisecond] {
	let inside = peak;

	for (
		let outside = Math.max(boundary, Math.min(peak + direction * SEARCH_STEP, boundary));
		direction < 0 ? outside >= boundary : outside <= boundary;
		outside = Math.max(boundary, Math.min(outside + direction * SEARCH_STEP, boundary))
	) {
		if (fn(outside) >= 0) {
			return direction < 0 ? [ outside, inside ] : [ inside, outside ];
		}

		if (outside === boundary) {
			break;
		}

		inside = outside;
	}

	return null;
}

function createContact(timestamp: Millisecond, observer: Required<Observer>): SolarEclipseContact {
	const state = calculateSolarEclipseState(timestamp, observer);

	return {
		sunAltitude: state.sun.apparentAltitude,
		sunAzimuth: state.sun.azimuth,
		time: new Date(timestamp),
		visible: state.sun.apparentAltitude + state.sun.angularRadius > 0
	};
}

function getVisibility(
	begin: Millisecond,
	peak: Millisecond,
	end: Millisecond,
	observer: Required<Observer>
): SolarEclipseVisibility {
	let anyVisible = false;
	let allVisible = true;
	const instants = new Set([ begin, peak, end ]);

	for (let timestamp = begin + SEARCH_STEP; timestamp < end; timestamp += SEARCH_STEP) {
		instants.add(timestamp);
	}

	for (const timestamp of instants) {
		const state = calculateSolarEclipseState(timestamp, observer);
		const visible = state.sun.apparentAltitude + state.sun.angularRadius > 0;

		anyVisible ||= visible;
		allVisible &&= visible;
	}

	return allVisible ? "FULL" : anyVisible ? "PARTIAL" : "NONE";
}

function solveCandidate(newMoon: Millisecond, observer: Required<Observer>): LocalSolarEclipse | null {
	const start = Math.max(MIN_TIMESTAMP, newMoon - CANDIDATE_WINDOW);
	const end = Math.min(MAX_TIMESTAMP, newMoon + CANDIDATE_WINDOW);
	const value = (timestamp: Millisecond) => contactValue(timestamp, observer);
	let coarsePeak = start;
	let coarseValue = value(start);

	for (let timestamp = Math.min(start + SEARCH_STEP, end); timestamp <= end; timestamp += SEARCH_STEP) {
		const currentValue = value(timestamp);

		if (currentValue < coarseValue) {
			coarsePeak = timestamp;
			coarseValue = currentValue;
		}
	}

	const peak = refineMinimum({
		fn: value,
		left: Math.max(start, coarsePeak - SEARCH_STEP),
		right: Math.min(end, coarsePeak + SEARCH_STEP),
		tolerance: ROOT_TOLERANCE
	});

	if (value(peak) >= 0) {
		return null;
	}

	const beginBracket = findContactBracket(value, peak, start, -1);
	const endBracket = findContactBracket(value, peak, end, 1);

	if (beginBracket === null || endBracket === null) {
		return null;
	}

	const begin = refineRoot({
		fn: value,
		left: beginBracket[0],
		right: beginBracket[1],
		tolerance: ROOT_TOLERANCE
	});

	const finish = refineRoot({
		fn: value,
		left: endBracket[0],
		right: endBracket[1],
		tolerance: ROOT_TOLERANCE
	});

	const state = calculateSolarEclipseState(peak, observer);

	if (state.phase === "NONE") {
		return null;
	}

	return {
		obscuration: state.obscuration,
		partialBegin: createContact(begin, observer),
		partialEnd: createContact(finish, observer),
		peak: createContact(peak, observer),
		type: state.phase,
		visibility: getVisibility(begin, peak, finish, observer)
	};
}

function getCandidateNear(
	timestamp: Millisecond,
	observer: Required<Observer>,
	margin: Millisecond
): LocalSolarEclipse | null {
	const searchMargin = SEARCH_MARGIN + margin;
	const candidateStart = Math.max(MIN_TIMESTAMP, timestamp - searchMargin);
	const newMoon = nextNewMoon(candidateStart);

	if (isNullable(newMoon) || newMoon > timestamp + searchMargin) {
		return null;
	}

	return solveCandidate(newMoon, observer);
}

function containsInstant(
	event: LocalSolarEclipse,
	timestamp: Millisecond,
	margin: Millisecond
): boolean {
	return event.partialBegin.time.getTime() - margin <= timestamp
		&& timestamp <= event.partialEnd.time.getTime() + margin;
}

export function getLocalSolarEclipse({ instant, observer }: SolarEclipseInput): LocalSolarEclipse | null {
	const timestamp = toTimestamp(instant);
	const location = validateObserver(observer);
	const state = calculateSolarEclipseState(timestamp, location);

	if (state.phase === "NONE") {
		return null;
	}

	const event = getCandidateNear(timestamp, location, 0);

	if (!isNullable(event) && containsInstant(event, timestamp, 0)) {
		return event;
	}

	return null;
}

export function getNearbyLocalSolarEclipse({
	instant,
	margin,
	observer
}: NearbySolarEclipseInput): LocalSolarEclipse | null {
	if (!Number.isFinite(margin) || margin < 0) {
		throw new RangeError("Solar eclipse proximity margin must be a non-negative finite number");
	}

	const timestamp = toTimestamp(instant);
	const location = validateObserver(observer);
	const event = getCandidateNear(timestamp, location, margin);

	if (!isNullable(event) && containsInstant(event, timestamp, margin)) {
		return event;
	}

	return null;
}

function findLocalSolarEclipse(
	{ instant, observer, visibleOnly }: SolarEclipseSearchInput,
	direction: -1 | 1
): LocalSolarEclipse | null {
	const timestamp = toTimestamp(instant);
	const location = validateObserver(observer);

	let newMoon = direction > 0
		? nextNewMoon(Math.max(MIN_TIMESTAMP, timestamp - SEARCH_MARGIN))
		: previousNewMoon(Math.min(MAX_TIMESTAMP, timestamp + SEARCH_MARGIN));

	while (!isNullable(newMoon)) {
		const event = solveCandidate(newMoon, location);
		const peak = event?.peak.time.getTime();
		const isInDirection = peak !== undefined && (direction > 0
			? peak > timestamp + PEAK_COMPARISON_TOLERANCE
			: peak < timestamp - PEAK_COMPARISON_TOLERANCE);

		if (!isNullable(event) && isInDirection && (!visibleOnly || event.visibility !== "NONE")) {
			return event;
		}

		newMoon = direction > 0
			? nextNewMoon(newMoon + DAY_MS)
			: previousNewMoon(newMoon - DAY_MS);
	}

	return null;
}

export function findNextLocalSolarEclipse(input: SolarEclipseSearchInput): LocalSolarEclipse | null {
	return findLocalSolarEclipse(input, 1);
}

export function findPreviousLocalSolarEclipse(input: SolarEclipseSearchInput): LocalSolarEclipse | null {
	return findLocalSolarEclipse(input, -1);
}
