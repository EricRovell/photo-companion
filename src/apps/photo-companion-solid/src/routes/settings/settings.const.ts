import { SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";

import type { LightsCity } from "types";
import type { InputSelectOption } from "ui-solid";

import type { Translation } from "@lib/context";

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
