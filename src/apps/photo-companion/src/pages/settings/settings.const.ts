import { routeBridges, routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
import { lightsCityList } from "@lib/constants";
import { dict } from "@lib/dict";
import type { InputSelectOption, Option } from "@lib/components";

export const LIGHTS_CITY_OPTIONS: Option[] = [
	{ label: dict.LABEL.OFF, value: "" },
	...lightsCityList.map(item => ({ label: dict.CITIES[item], value: item }))
];

export const STARTING_PAGE_OPTIONS: InputSelectOption[] = [
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
		value: routeBridges
	},
	{
		label: dict.TITLE.LIGHTS,
		value: routeLights
	}
];
