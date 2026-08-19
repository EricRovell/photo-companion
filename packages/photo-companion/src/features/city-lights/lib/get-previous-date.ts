import { incrementDateByDay } from "utils/date";

export function getPreviousDate(date: Date): Date {
	return incrementDateByDay(date, -1);
}
