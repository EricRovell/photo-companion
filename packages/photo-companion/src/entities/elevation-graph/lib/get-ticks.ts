import { round } from "utils/math";

import * as consts from "../consts";

import type { Tick } from "../types";

export function getTicks() {
	const ticks: Tick[] = [];
	const xStep = round(consts.X_RANGE / (consts.TICK_COUNT + 1), 2);
	const y = consts.Y_MAX + consts.Y_RANGE_TICKS / 2;

	for (let i = 1; i <= consts.TICK_COUNT; i++) {
		ticks.push({
			text: i.toString().padStart(2, "0"),
			x: i * xStep,
			y
		});
	}

	return ticks;
}
