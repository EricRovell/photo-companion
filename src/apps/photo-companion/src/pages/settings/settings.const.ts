import type { InputSelectOption, Option } from "ui";
import { routeBridges, routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
import { lightsCityList } from "@lib/constants";
import { SUPPORTED_BRIDGES_NAME_SET, isNavigationTime } from "bridge-schedule";
import { dict } from "@lib/dict";
import type { SettingsStore } from "@lib/stores/settings";
import { isNullable } from "@shared/utils";

export const BRIDGES_SPB_OPTIONS: Option[] = [
	{
		label: dict.LABEL.OFF,
		value: ""
	},
	{
		label: dict.LABEL.NAVIGATION_ONLY,
		value: "navigation"
	},
	{
		label: dict.LABEL.ALWAYS,
		value: "always"
	}
];

export const LIGHTS_CITY_OPTIONS: Option[] = [
	{ label: dict.LABEL.OFF, value: "" },
	...lightsCityList.map(item => ({ label: dict.CITIES[item], value: item }))
];

export const GET_STARTING_PAGE_OPTIONS = (
	options: Pick<SettingsStore, "bridges_spb" | "lights_city">
): InputSelectOption[] => {

	return [
		{
			label: dict.TITLE.TIMELINE,
			value: routeTimeline
		},
		{
			label: dict.TITLE.SUN,
			value: routeSun
		},
		{
			label: dict.TITLE.MOON,
			value: routeMoon
		},
		{
			label: dict.TITLE.BRIDGES,
			value: routeBridges,
			disabled: isNullable(options.bridges_spb) || (options.bridges_spb === "navigation" && !isNavigationTime())
		},
		{
			label: dict.TITLE.LIGHTS,
			value: routeLights,
			disabled: isNullable(options.lights_city)
		}
	];
};

export const BRIDGES_EVENTS_OPTIONS: Option[] = Array
	.from(SUPPORTED_BRIDGES_NAME_SET)
	.flatMap(item => [
		{
			label: dict.BRIDGE_SPB_EVENTS[`${item}_OPEN`],
			value: `${item}_OPEN`
		},
		{
			label: dict.BRIDGE_SPB_EVENTS[`${item}_CLOSE`],
			value: `${item}_CLOSE`
		}
	]);
