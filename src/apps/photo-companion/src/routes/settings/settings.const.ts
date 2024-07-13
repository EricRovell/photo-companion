import { SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";

import type { LightsCity } from "types";
import type { InputSelectOption } from "ui";

import type { SettingsStore, Translation } from "@lib/context";

export const lightsCityList: LightsCity[] = [
	"MOSCOW",
	"SAINT_PETERSBURG"
];

export const LIGHTS_CITY_OPTIONS = (t: Translation): InputSelectOption[] => {
	return lightsCityList
		.map(item => ({
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
	EVENTS_BRIDGES_SPB: "events_bridges_spb",
	EVENTS_LIGHTS: "events_bridges_spb",
	EVENTS_MOON: "events_bridges_spb",
	EVENTS_SUN: "events_bridges_spb",
	LANGUAGE: "language",
	LATITUDE: "latitude",
	LIGHTS_CITY: "lights_city",
	LONGITUDE: "longitude",
	TABS: "tabs"
};
