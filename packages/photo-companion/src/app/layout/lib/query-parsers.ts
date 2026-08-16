import { isLatitude, isLongitude, isNonEmptyString } from "utils/validators";

import { type SearchParamValue } from "~/shared/lib/use-search-params";

export function parseLatitude(value: SearchParamValue) {
	if (!isNonEmptyString(value)) {
		return null;
	}

	const latitude = Number(value);

	return isLatitude(latitude) ? latitude : null;
}

export function parseLongitude(value: SearchParamValue) {
	if (!isNonEmptyString(value)) {
		return null;
	}

	const longitude = Number(value);

	return isLongitude(longitude) ? longitude : null;
}
