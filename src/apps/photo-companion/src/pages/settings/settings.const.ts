import { routeBridges, routeLights, routeMoon, routeSun, routeTimeline } from "@lib/routes";
import { lightsCityList } from "@lib/constants";
import { dict } from "@lib/dict";
import type { InputSelectOption, Option } from "@lib/components";

export const LIGHTS_CITY_OPTIONS: Option[] = [
	{ label: dict["off"], value: "" },
	...lightsCityList.map(item => ({ label: dict[item], value: item }))
];

export const STARTING_PAGE_OPTIONS: InputSelectOption[] = [
	{
		label: dict["timeline"],
		value: routeTimeline
	},
	{
		label: dict["sun"],
		value: routeSun
	},
	{
		label: dict["moon"],
		value: routeMoon
	},
	{
		label: dict["bridges"],
		value: routeBridges
	},
	{
		label: dict["lights"],
		value: routeLights
	}
];
