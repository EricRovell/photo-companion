import { createEffect } from "solid-js";
import { isNullable } from "utils/validators";

import { useSettings } from "~/features/settings";
import { useParsedSearchParams } from "~/shared/lib/use-search-params";

import { parseLatitude, parseLongitude } from "../lib";

export function useLocationQuery() {
	const { searchParams } = useParsedSearchParams({
		latitude: parseLatitude,
		longitude: parseLongitude
	});

	const { setSettings } = useSettings();

	createEffect(() => ({
		latitude: searchParams.latitude,
		longitude: searchParams.longitude
	}), ({ latitude, longitude }) => {
		if (isNullable(latitude) || isNullable(longitude)) {
			return;
		}

		setSettings((draft) => {
			draft.latitude = latitude;
			draft.longitude = longitude;
		});
	});
}
