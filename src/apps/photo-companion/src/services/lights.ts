import { SETTINGS_DEFAULT } from "@lib/settings-store";
import { settingsStore } from "@lib/settings-store";
import { initLightsProvider } from "lights-schedule";

let city = SETTINGS_DEFAULT["lights-city"];

export let provider = initLightsProvider(city);

settingsStore.subscribe(value => {
	if (value && city !== value?.["lights-city"]) {
		city = value["lights-city"];
		provider = initLightsProvider(city);
	}
});
