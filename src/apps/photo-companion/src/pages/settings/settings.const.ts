import { SUPPORTED_BRIDGES_NAME_SET } from "bridge-schedule";
import type { Option } from "ui";

import { lightsCityList } from "@lib/constants";
import { dict } from "@lib/dict";

export const LIGHTS_CITY_OPTIONS: Option[] = lightsCityList
	.map(item => ({
		label: dict.CITIES[item],
		value: item
	}));

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
