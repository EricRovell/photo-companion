import { normalizeDegrees } from "utils/math";

import type { CardinalLabels } from "../types";

const CARDINAL_DIRECTION_KEYS = [
	"NORTH",
	"NORTH_EAST",
	"EAST",
	"SOUTH_EAST",
	"SOUTH",
	"SOUTH_WEST",
	"WEST",
	"NORTH_WEST"
] as const;

export function getCardinalDirection(angle: number, labels: CardinalLabels) {
	const directions = {
		EAST: labels.east,
		NORTH: labels.north,
		NORTH_EAST: `${labels.north}${labels.east}`,
		NORTH_WEST: `${labels.north}${labels.west}`,
		SOUTH: labels.south,
		SOUTH_EAST: `${labels.south}${labels.east}`,
		SOUTH_WEST: `${labels.south}${labels.west}`,
		WEST: labels.west
	};
	const index = Math.round(normalizeDegrees(angle) / 45) % CARDINAL_DIRECTION_KEYS.length;

	return directions[CARDINAL_DIRECTION_KEYS[index]];
}
