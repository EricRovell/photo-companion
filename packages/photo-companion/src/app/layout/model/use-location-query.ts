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

	createEffect(() => {
		const { latitude, longitude } = searchParams;

		if (isNullable(latitude) || isNullable(longitude)) {
			return;
		}

		setSettings({ latitude, longitude });
	});
}
