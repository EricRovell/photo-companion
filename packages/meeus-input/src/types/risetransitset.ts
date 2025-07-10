import type { Degree, Hour, JulianDay } from "./units";


export interface TransitInternals {
  cosH0: number | undefined
  m0: number | undefined
}

/**
 * The various elements of the transit of an object
 */
export interface Transit {
  altitude: Degree | undefined,
  internals: TransitInternals
  isAboveAltitude: boolean, // for when altitude is not that of horizon
  isAboveHorizon: boolean,
  isCircumpolar: boolean // no transit, no rise
  julianDay: JulianDay | undefined,
  refAltitude: Degree,
  utc: Hour | undefined,
}

/**
 * The various elements of the rise, set and transit of an object
 */
export interface RiseTransitSet {
  rise: {
    julianDay: JulianDay | undefined
    utc: Hour | undefined,
  },
  set: {
    julianDay: JulianDay | undefined
    utc: Hour | undefined,
  }
  transit: Transit,
}
