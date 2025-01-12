import { isLeapYear } from "utils/date";

export function getFullYearDaysList (year = new Date().getFullYear()) {
	const dates: Date[] = [];
	const daysCount = isLeapYear(year) ? 366 : 365;

	for (let i = 1; i <= daysCount; i++) {
		dates.push(new Date(year, 0, i));
	}

	return dates;
}
