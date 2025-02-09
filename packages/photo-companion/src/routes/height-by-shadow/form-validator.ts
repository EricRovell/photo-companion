import { isNonNegativeNumber, isValidDate, isWithinRange } from "utils/validators";

import type { FormKey, Model } from "./height-by-shadow.context";

export function validate(state: Model): Record<FormKey, boolean> {
	return {
		date: !isValidDate(state.date),
		latitude: !isWithinRange(state.latitude, 0, 90),
		latitude_direction: false,
		length_shadow: !isNonNegativeNumber(state.length_shadow),
		level_object: !isNonNegativeNumber(state.level_object),
		level_shadow:  !isNonNegativeNumber(state.level_shadow),
		longitude: !isWithinRange(state.longitude, 0, 180),
		longitude_direction: false,
		solar_azimuth_angle: !isNonNegativeNumber(state.solar_azimuth_angle) || state.solar_azimuth_angle > 359
	};
}
