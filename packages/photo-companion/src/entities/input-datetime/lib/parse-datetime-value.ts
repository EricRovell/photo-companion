import { isNonEmptyString } from "utils/validators";

import { parseDatetimeLocal } from "~/shared/lib/query-date";

export function parseDatetimeValue(value: unknown): Date | null {
	return isNonEmptyString(value) ? parseDatetimeLocal(value) : null;
}
