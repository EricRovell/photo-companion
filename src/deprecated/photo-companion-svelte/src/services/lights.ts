import { settingsStore, SETTINGS_DEFAULT } from "@lib/stores";
import { initLightsProvider } from "lights-schedule";
import { isNullable } from "utils/validators";

let city = SETTINGS_DEFAULT.lights_city;

export let provider = initLightsProvider(city);

settingsStore.subscribe(value => {
	if (isNullable(value?.lights_city)) {
		return;
	}

	if (city !== value?.lights_city) {
		city = value.lights_city;
		provider = initLightsProvider(city);
	}
});
