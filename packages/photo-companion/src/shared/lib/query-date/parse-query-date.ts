import { isNullable } from "utils/validators";

import { createDateFromMatch } from "./create-date-from-match";

const QUERY_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;

/**
 * Parses a query `datetime` string in format YYYY-MM-DDTHH:mm:ss.
 * Invalid values fallback to the current local date and time.
 */
export function parseQueryDate(input: string): Date {
	const match = QUERY_DATE_REGEX.exec(input);
	const output = isNullable(match) ? null : createDateFromMatch(match);

	if (isNullable(output)) {
		console.warn(`Invalid date input: ${input}`);
		return new Date();
	}

	return output;
}
