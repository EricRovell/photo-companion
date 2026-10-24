import { CITY_LIGHTS_WIDGET_CONFIG } from "../config";

import type { CityLightsGraphLabel, CityLightsNightEvent } from "../types";

export function getCityLightsLabelEdge(position: number) {
	return position < 10 ? "start" : position > 90 ? "end" : undefined;
}

export function getCityLightsGraphLabels(events: CityLightsNightEvent[]): CityLightsGraphLabel[] {
	let previousRow = 0;

	return events.map((event, index) => {
		const row = index > 0 && event.position - events[index - 1].position < CITY_LIGHTS_WIDGET_CONFIG.layout.labelSeparation
			? 1 - previousRow
			: 0;

		previousRow = row;

		return {
			...event,
			edge: getCityLightsLabelEdge(event.position),
			row
		};
	});
}
