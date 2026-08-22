import { shiftDate } from "utils/date";

import type { DateTimeStep } from "../types";

const MAX_YEAR = 9999;
const MIN_YEAR = 1;

export function shiftTimelineDate(input: Date, step: DateTimeStep, amount: number): Date | null {
	const output = shiftDate(input, step, amount);
	const year = output.getFullYear();

	return !Number.isNaN(output.getTime()) && year >= MIN_YEAR && year <= MAX_YEAR
		? output
		: null;
}
