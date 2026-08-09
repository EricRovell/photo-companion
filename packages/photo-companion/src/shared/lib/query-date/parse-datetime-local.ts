import { isNullable } from "utils/validators";

import { createDateFromMatch } from "./create-date-from-match";

const DATETIME_LOCAL_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.0{1,3})?)?$/;

/**
 * Parses a normalized `datetime-local` value without relying on Date string parsing.
 */
export function parseDatetimeLocal(input: string): Nullish<Date> {
	const match = DATETIME_LOCAL_REGEX.exec(input);

	if (isNullable(match)) {
		return null;
	}

	return createDateFromMatch(match);
}
