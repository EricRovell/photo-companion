import { isNullable } from "utils/validators";

export function formatTestDate(date: Nullish<DateLike>): string {
	return isNullable(date) ? "" : new Date(date).toISOString();
}

export function formatTestTime(date: Nullish<DateLike>): string {
	return formatTestDate(date).slice(11, 16);
}
