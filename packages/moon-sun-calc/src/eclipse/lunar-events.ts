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
import { calculateLunarEclipseState } from "./lunar-state";

import type { PrincipalMoonPhaseName } from "../moon/types";
import type { Millisecond, Observer } from "../types";
import type {
	LocalLunarEclipse,
	LunarEclipseContact,
	LunarEclipseInput,
	LunarEclipseNoticeability,
	LunarEclipseSearchInput,
	LunarEclipseState,
	LunarEclipseVisibility,
	NearbyLunarEclipseInput
} from "./types";

const MIN_TIMESTAMP = Date.UTC(MIN_SUPPORTED_YEAR, 0, 1);
const MAX_TIMESTAMP = Date.UTC(MAX_SUPPORTED_YEAR, 11, 31, 23, 59, 59, 999);

type ContactBoundary = "partial" | "penumbral" | "total";

function nextMoonPhase(timestamp: Millisecond, phase: PrincipalMoonPhaseName): Millisecond | null {
	try {
		return getNextMoonPhases(timestamp, 4)
			.find(event => event.phase === phase)
			?.time.getTime() ?? null;
	} catch (error) {
		if (error instanceof RangeError) {
			return null;
		}

		throw error;
	}
}

function previousMoonPhase(timestamp: Millisecond, phase: PrincipalMoonPhaseName): Millisecond | null {
	let end = timestamp;

	while (end > MIN_TIMESTAMP) {
		const start = Math.max(MIN_TIMESTAMP, end - 40 * DAY_MS);

		try {
			const candidates = getNextMoonPhases(start, 4)
				.filter(event => event.phase === phase && event.time.getTime() < timestamp);

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

function contactValue(state: LunarEclipseState, boundary: ContactBoundary): number {
	if (boundary === "penumbral") {
		return state.separation - state.shadow.penumbraAngularRadius - state.moon.angularRadius;
	}

	if (boundary === "partial") {
		return state.separation - state.shadow.umbraAngularRadius - state.moon.angularRadius;
	}

	return state.separation - state.shadow.umbraAngularRadius + state.moon.angularRadius;
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

function solveContact(
	fn: (timestamp: Millisecond) => number,
	peak: Millisecond,
	boundary: Millisecond,
	direction: -1 | 1
): Millisecond | null {
	const bracket = findContactBracket(fn, peak, boundary, direction);

	return bracket === null ? null : refineRoot({
		fn,
		left: bracket[0],
		right: bracket[1],
		tolerance: ROOT_TOLERANCE
	});
}

function createContact(timestamp: Millisecond, observer: Required<Observer>): LunarEclipseContact {
	const state = calculateLunarEclipseState(timestamp, observer);

	return {
		moonAltitude: state.moon.apparentAltitude,
		moonAzimuth: state.moon.azimuth,
		time: new Date(timestamp),
		visible: state.moon.apparentAltitude + state.moon.angularRadius > 0
	};
}

function getVisibility(
	begin: Millisecond,
	peak: Millisecond,
	end: Millisecond,
	observer: Required<Observer>
): LunarEclipseVisibility {
	let anyVisible = false;
	let allVisible = true;
	const instants = new Set([ begin, peak, end ]);

	for (let timestamp = begin + SEARCH_STEP; timestamp < end; timestamp += SEARCH_STEP) {
		instants.add(timestamp);
	}

	for (const timestamp of instants) {
		const state = calculateLunarEclipseState(timestamp, observer);
		const visible = state.moon.apparentAltitude + state.moon.angularRadius > 0;

		anyVisible ||= visible;
		allVisible &&= visible;
	}

	return allVisible ? "FULL" : anyVisible ? "PARTIAL" : "NONE";
}

function getNoticeability(state: LunarEclipseState): LunarEclipseNoticeability {
	if (state.phase === "PENUMBRAL") {
		return state.penumbralMagnitude >= 0.6 ? "SUBTLE" : "UNLIKELY";
	}

	return "CLEAR";
}

function solveCandidate(fullMoon: Millisecond, observer: Required<Observer>): LocalLunarEclipse | null {
	const start = Math.max(MIN_TIMESTAMP, fullMoon - CANDIDATE_WINDOW);
	const end = Math.min(MAX_TIMESTAMP, fullMoon + CANDIDATE_WINDOW);
	const separation = (timestamp: Millisecond) => calculateLunarEclipseState(timestamp, observer).separation;
	let coarsePeak = start;
	let coarseValue = separation(start);

	for (let timestamp = Math.min(start + SEARCH_STEP, end); timestamp <= end; timestamp += SEARCH_STEP) {
		const currentValue = separation(timestamp);

		if (currentValue < coarseValue) {
			coarsePeak = timestamp;
			coarseValue = currentValue;
		}
	}

	const peak = refineMinimum({
		fn: separation,
		left: Math.max(start, coarsePeak - SEARCH_STEP),
		right: Math.min(end, coarsePeak + SEARCH_STEP),
		tolerance: ROOT_TOLERANCE
	});
	const state = calculateLunarEclipseState(peak, observer);

	if (state.phase === "NONE") {
		return null;
	}

	const value = (boundary: ContactBoundary) => (timestamp: Millisecond) =>
		contactValue(calculateLunarEclipseState(timestamp, observer), boundary);
	const penumbralBegin = solveContact(value("penumbral"), peak, start, -1);
	const penumbralEnd = solveContact(value("penumbral"), peak, end, 1);

	if (penumbralBegin === null || penumbralEnd === null) {
		return null;
	}

	const partialBegin = state.phase === "PENUMBRAL"
		? null
		: solveContact(value("partial"), peak, start, -1);

	const partialEnd = state.phase === "PENUMBRAL"
		? null
		: solveContact(value("partial"), peak, end, 1);

	const totalBegin = state.phase === "TOTAL"
		? solveContact(value("total"), peak, start, -1)
		: null;

	const totalEnd = state.phase === "TOTAL"
		? solveContact(value("total"), peak, end, 1)
		: null;

	if (
		(state.phase !== "PENUMBRAL" && (isNullable(partialBegin) || isNullable(partialEnd))) ||
		(state.phase === "TOTAL" && (isNullable(totalBegin) || isNullable(totalEnd)))
	) {
		return null;
	}

	return {
		noticeability: getNoticeability(state),
		partialBegin: partialBegin === null ? null : createContact(partialBegin, observer),
		partialEnd: partialEnd === null ? null : createContact(partialEnd, observer),
		peak: createContact(peak, observer),
		penumbralBegin: createContact(penumbralBegin, observer),
		penumbralEnd: createContact(penumbralEnd, observer),
		penumbralMagnitude: state.penumbralMagnitude,
		totalBegin: totalBegin === null ? null : createContact(totalBegin, observer),
		totalEnd: totalEnd === null ? null : createContact(totalEnd, observer),
		type: state.phase,
		umbralMagnitude: state.umbralMagnitude,
		visibility: getVisibility(penumbralBegin, peak, penumbralEnd, observer)
	};
}

function getCandidateNear(
	timestamp: Millisecond,
	observer: Required<Observer>,
	margin: Millisecond
): LocalLunarEclipse | null {
	const searchMargin = SEARCH_MARGIN + margin;
	const candidateStart = Math.max(MIN_TIMESTAMP, timestamp - searchMargin);
	const fullMoon = nextMoonPhase(candidateStart, "FULL_MOON");

	if (isNullable(fullMoon) || fullMoon > timestamp + searchMargin) {
		return null;
	}

	return solveCandidate(fullMoon, observer);
}

function containsInstant(event: LocalLunarEclipse, timestamp: Millisecond, margin: Millisecond): boolean {
	return event.penumbralBegin.time.getTime() - margin <= timestamp
		&& timestamp <= event.penumbralEnd.time.getTime() + margin;
}

export function getLocalLunarEclipse({ instant, observer }: LunarEclipseInput): LocalLunarEclipse | null {
	const timestamp = toTimestamp(instant);
	const location = validateObserver(observer);
	const state = calculateLunarEclipseState(timestamp, location);

	if (state.phase === "NONE") {
		return null;
	}

	const event = getCandidateNear(timestamp, location, 0);

	return !isNullable(event) && containsInstant(event, timestamp, 0) ? event : null;
}

export function getNearbyLocalLunarEclipse({
	instant,
	margin,
	observer
}: NearbyLunarEclipseInput): LocalLunarEclipse | null {
	if (!Number.isFinite(margin) || margin < 0) {
		throw new RangeError("Lunar eclipse proximity margin must be a non-negative finite number");
	}

	const timestamp = toTimestamp(instant);
	const location = validateObserver(observer);
	const event = getCandidateNear(timestamp, location, margin);

	return !isNullable(event) && containsInstant(event, timestamp, margin) ? event : null;
}

function findLocalLunarEclipse(
	{ instant, observer, visibleOnly }: LunarEclipseSearchInput,
	direction: -1 | 1
): LocalLunarEclipse | null {
	const timestamp = toTimestamp(instant);
	const location = validateObserver(observer);

	let fullMoon = direction > 0
		? nextMoonPhase(Math.max(MIN_TIMESTAMP, timestamp - SEARCH_MARGIN), "FULL_MOON")
		: previousMoonPhase(Math.min(MAX_TIMESTAMP, timestamp + SEARCH_MARGIN), "FULL_MOON");

	while (!isNullable(fullMoon)) {
		const event = solveCandidate(fullMoon, location);
		const peak = event?.peak.time.getTime();
		const isInDirection = peak !== undefined && (direction > 0
			? peak > timestamp + PEAK_COMPARISON_TOLERANCE
			: peak < timestamp - PEAK_COMPARISON_TOLERANCE);

		if (!isNullable(event) && isInDirection && (!visibleOnly || event.visibility !== "NONE")) {
			return event;
		}

		fullMoon = direction > 0
			? nextMoonPhase(fullMoon + DAY_MS, "FULL_MOON")
			: previousMoonPhase(fullMoon - DAY_MS, "FULL_MOON");
	}

	return null;
}

export function findNextLocalLunarEclipse(input: LunarEclipseSearchInput): LocalLunarEclipse | null {
	return findLocalLunarEclipse(input, 1);
}

export function findPreviousLocalLunarEclipse(input: LunarEclipseSearchInput): LocalLunarEclipse | null {
	return findLocalLunarEclipse(input, -1);
}
