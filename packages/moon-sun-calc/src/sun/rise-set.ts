import { searchRiseSetIntervals } from "../rise-set/search";
import { SUNRISE_ALTITUDE } from "./consts";
import { findSunAltitudeCrossings } from "./events";

import type { RiseSetInterval, RiseSetSearchInput } from "../rise-set/types";

/**
 * Pair SUNRISE_START with the following SUNSET_END within explicit UTC bounds.
 */
export function findSunRiseSetIntervals({ interval, observer, options }: RiseSetSearchInput): RiseSetInterval[] {
	return searchRiseSetIntervals(interval, bounds => findSunAltitudeCrossings({
		altitude: SUNRISE_ALTITUDE,
		interval: bounds,
		observer,
		options
	}));
}
