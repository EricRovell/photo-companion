import { SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";

import type { City } from "types";
import type { InputSelectOption } from "ui";

import type { Translation } from "~/lib/context/translation";
import type { SettingsStore } from "~/services/settings";

export const cityOptions: City[] = [
	"MOSCOW",
	"SAINT_PETERSBURG",
	"OTHER"
];

export const CITY_OPTIONS = (t: Translation): InputSelectOption[] => {
	return cityOptions.map(item => ({
		label: t.CITIES[item],
		value: item
	}));
};

export const LANGUAGE_OPTIONS: InputSelectOption[] = [
	{
		label: "English",
		value: "en"
	},
	{
		label: "Русский",
		value: "ru"
	}
];

export const BRIDGES_EVENTS_OPTIONS = (t: Translation): InputSelectOption[] => {
	return Array
		.from(SUPPORTED_BRIDGES_NAME_SET)
		.flatMap(item => [
			{
				label: t.BRIDGE_SPB_EVENTS[`${item}_OPEN`],
				value: `${item}_OPEN`
			},
			{
				label: t.BRIDGE_SPB_EVENTS[`${item}_CLOSE`],
				value: `${item}_CLOSE`
			}
		]);
};

export const FORM_INPUT_NAME: Record<Uppercase<keyof SettingsStore>, keyof SettingsStore> = {
	CITY: "city",
	EVENTS_BRIDGES_SPB: "events_bridges_spb",
	EVENTS_LIGHTS: "events_bridges_spb",
	EVENTS_MOON: "events_bridges_spb",
	EVENTS_SUN: "events_bridges_spb",
	LANGUAGE: "language",
	LATITUDE: "latitude",
	LONGITUDE: "longitude",
	TABS: "tabs"
};
