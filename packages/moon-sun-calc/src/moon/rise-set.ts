import { searchRiseSetIntervals } from "../rise-set/search";
import { findMoonHorizonCrossings } from "./crossings";

import type { RiseSetInterval, RiseSetSearchInput } from "../rise-set/types";

/**
 * Pair MOONRISE with the following MOONSET within explicit UTC bounds.
 */
export function findMoonRiseSetIntervals({ interval, observer, options }: RiseSetSearchInput): RiseSetInterval[] {
	return searchRiseSetIntervals(interval, bounds => findMoonHorizonCrossings({ interval: bounds, observer, options }));
}
