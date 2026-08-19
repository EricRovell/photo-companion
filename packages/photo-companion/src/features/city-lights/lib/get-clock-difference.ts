import { getMinuteOfDay } from "./get-minute-of-day";

const MINUTES_PER_DAY = 24 * 60;

/**
 * Returns the shortest signed distance between two wall-clock times.
 */
export function getClockDifference(current: number, previous: number): number {
	const difference = getMinuteOfDay(current) - getMinuteOfDay(previous);
	return ((difference + MINUTES_PER_DAY / 2) % MINUTES_PER_DAY + MINUTES_PER_DAY)
		% MINUTES_PER_DAY - MINUTES_PER_DAY / 2;
}
