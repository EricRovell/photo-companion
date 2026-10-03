import { scale } from "utils/math";

import type { SeasonGraphRange } from "../types";

export function getSeasonGraphRange(year: number): SeasonGraphRange {
	return {
		end: new Date(year + 1, 0, 1).getTime(),
		start: new Date(year, 0, 1).getTime()
	};
}

export function getSeasonProgress(datetime: Date, range: SeasonGraphRange): number {
	return scale(datetime.getTime(), range.start, range.end, 0, 1);
}
