import { isLatitude, isLongitude, isNonNegativeNumber, isTimezone, isValidDate } from "utils/validators";

import type { FormKey, FormState } from "./height-by-shadow.context";

export function validate(state: FormState): Record<FormKey, boolean> {
	return {
		date: !isValidDate(state.date),
		latitude: !isLatitude(state.latitude),
		length_shadow: !isNonNegativeNumber(state.length_shadow),
		level_object: !isNonNegativeNumber(state.level_object),
		level_shadow:  !isNonNegativeNumber(state.level_shadow),
		longitude: !isLongitude(state.longitude),
		time: !isValidDate(state.date),
		timezone: !isTimezone(state.timezone)
	};
}
