import { isNullable, isValidDate } from "utils/validators";

/**
 * Parses a query `datetime` string in format YYYY-MM-DD-hh-mm
 * into a Date object.
 */
export function parseQueryDate(input: string): Date {
	if (isNullable(input)) {
		return new Date();
	}

	const [ yy, mm, dd, h, m ] = input.split("-").map(Number);
	const output = new Date(yy, mm - 1, dd, h, m);

	if (!isValidDate(output)) {
		console.warn(`Invalid date input: ${input}`);
	}

	return output;
}

export function createQueryDate(d: DateLike = new Date()): string {
	if (typeof d === "number") {
		d = new Date(d);
	}

	return [
		d.getFullYear(),
		d.getMonth() + 1,
		d.getDate(),
		d.getHours(),
		d.getMinutes()
	]
		.map(value => value.toString().padStart(2, "0"))
		.join("-");
}
