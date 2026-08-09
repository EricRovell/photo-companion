import { isNullable } from "utils/validators";

import { parseDatetimeLocal } from "~/shared/lib/query-date";

/**
 * Parses a browser-normalized `datetime-local` value.
 */
export function parseDateTimeString(input: string): Date {
	const output = parseDatetimeLocal(input);

	if (isNullable(output)) {
		console.warn(`Invalid date input: ${input}`);
		return new Date();
	}

	return output;
}
