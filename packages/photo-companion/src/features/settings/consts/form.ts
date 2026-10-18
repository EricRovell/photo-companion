import { SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";

import type { City } from "types";

import type { SettingsStore } from "../types";
import type { Translation } from "~/features/translation";
import type { InputSelectOption } from "~/shared/ui";

type BridgeEventMessage = Translation["BRIDGE_SPB_EVENT"][keyof Translation["BRIDGE_SPB_EVENT"]];
type BridgeEventMessageFormatter = (input: BridgeEventMessage, values: { bridge: string }) => string;

const cityOptions: City[] = [
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

export const BRIDGES_EVENTS_OPTIONS = (
	t: Translation,
	message: BridgeEventMessageFormatter
): InputSelectOption[] => {
	return Array
		.from(SUPPORTED_BRIDGES_NAME_SET)
		.flatMap(item => [
			{
				label: message(t.BRIDGE_SPB_EVENT.OPEN, {
					bridge: t.BRIDGE_NAME_SPB[item]
				}),
				value: `${item}_OPEN`
			},
			{
				label: message(t.BRIDGE_SPB_EVENT.CLOSE, {
					bridge: t.BRIDGE_NAME_SPB[item]
				}),
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
