import { createQueryDate } from "~/shared/lib/query-date";

/**
 * Returns a local ISO datetime string with second precision.
 */
export function getDateTimeString(date: DateLike = new Date()): string {
	return createQueryDate(date);
}
