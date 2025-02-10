import { isNonNegativeNumber, isValidDate, isWithinRange } from "utils/validators";

import type { FormKey, Model } from "./height-by-shadow.context";

export function validate(model: Model): Record<FormKey, boolean> {
	return {
		date: !isValidDate(model.date),
		latitude: !isWithinRange(model.latitude, 0, 90),
		latitude_direction: false,
		length_shadow: !isNonNegativeNumber(model.length_shadow),
		level_object: !isNonNegativeNumber(model.level_object),
		level_shadow:  !isNonNegativeNumber(model.level_shadow),
		longitude: !isWithinRange(model.longitude, 0, 180),
		longitude_direction: false,
		solar_azimuth_angle: !isNonNegativeNumber(model.solar_azimuth_angle) || model.solar_azimuth_angle > 359
	};
}
