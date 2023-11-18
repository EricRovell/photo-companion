import { getDateTimeString, isValidDate } from "@lib/helpers";

function formatNumber(input: number): string {
	return (input < 10)
		? `0${input}`
		: input.toString();
}

export function parseQueryDate(input: string): string {
	if (!input) {
		return getDateTimeString();
	}

	const [ yy, mm, dd, h, m ] = input.split("-").map(Number);

	const date = new Date(yy, mm - 1, dd, h, m);

	if (!isValidDate(date)) {
		return "invalid";
	}

	return getDateTimeString(date);
}

export function createQueryDate(d: Date): string {
	return [
		d.getFullYear(),
		d.getMonth() + 1,
		d.getDate(),
		d.getHours(),
		d.getMinutes()
	]
		.map(value => formatNumber(value))
		.join("-");
}
