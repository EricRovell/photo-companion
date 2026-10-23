export {
	findNextLocalLunarEclipse,
	findNextLocalSolarEclipse,
	findPreviousLocalLunarEclipse,
	findPreviousLocalSolarEclipse,
	getLocalLunarEclipse,
	getLocalSolarEclipse,
	getLunarEclipseState,
	getNearbyLocalLunarEclipse,
	getNearbyLocalSolarEclipse,
	getSolarEclipseState
} from "./eclipse";

export type * from "./eclipse/types";

export {
	findMoonRiseSetIntervals,
	getMoonAge,
	getMoonEvents,
	getMoonIllumination,
	getMoonPosition,
	getMoonZenithAngle,
	getNextMoonPhases
} from "./moon";

export type * from "./moon/types";

export type { RiseSetInterval, RiseSetSearchInput } from "./rise-set/types";

export { MAX_SUPPORTED_YEAR, MIN_SUPPORTED_YEAR } from "./shared/consts";

export {
	findSunAltitudeCrossings,
	findSunAzimuthCrossings,
	findSunRiseSetIntervals,
	getSeasonEvents,
	getSunEvents,
	getSunPosition
} from "./sun";

export type * from "./sun/types";
export type * from "./types";
