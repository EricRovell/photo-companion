import { createQueryDate } from "~/shared/lib/query-date";

export function getCalendarSelectionDatetime(timestamp: number, current: Date): string {
	const date = new Date(timestamp);
	const nextDayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
	date.setHours(current.getHours(), current.getMinutes(), current.getSeconds(), 0);

	// A clock change can push a skipped local time into the next date.
	return createQueryDate(Math.min(date.getTime(), nextDayStart - 1));
}
