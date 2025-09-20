import { isNullable, isValidDate } from "utils/validators";

/**
 * Calculates the angle in degrees from `Date` object using time for 24 hour circle.
 */
export function getAngleFromTime(date: Nullish<DateLike> = new Date(), fallback = 0): number {
	if (isNullable(date) || !isValidDate(date)) {
		return fallback;
	}

	const hours = new Date(date).getHours();
	const minutes = new Date(date).getMinutes();
	return Math.round(360 * (hours * 60 + minutes) / (24 * 60));
}
