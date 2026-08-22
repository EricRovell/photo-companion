import { shiftDate } from "utils/date";

export function getPreviousDate(date: Date): Date {
	return shiftDate(date, "day", -1);
}
