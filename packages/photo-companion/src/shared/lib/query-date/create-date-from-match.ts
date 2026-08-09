import { isNullable } from "utils/validators";

export function createDateFromMatch(match: RegExpMatchArray): Nullish<Date> {
	const [ year, month, day, hours, minutes ] = match.slice(1, 6).map(Number);
	const seconds = isNullable(match[6]) ? 0 : Number(match[6]);

	if (
		year < 1 ||
		month < 1 || month > 12 ||
		day < 1 || day > 31 ||
		hours < 0 || hours > 23 ||
		minutes < 0 || minutes > 59 ||
		seconds < 0 || seconds > 59
	) {
		return null;
	}

	const output = new Date(0);
	output.setFullYear(year, month - 1, day);
	output.setHours(hours, minutes, seconds, 0);

	if (
		output.getFullYear() !== year ||
		output.getMonth() !== month - 1 ||
		output.getDate() !== day ||
		output.getHours() !== hours ||
		output.getMinutes() !== minutes ||
		output.getSeconds() !== seconds
	) {
		return null;
	}

	return output;
}
