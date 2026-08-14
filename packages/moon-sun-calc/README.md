# moon-sun-calc

A private workspace TypeScript library for Sun and Moon positions, illumination,
principal phases, and rise/set/transit events. The numerical model follows the
higher-order methods in Jean Meeus, *Astronomical Algorithms*, 2nd edition.

## Design contract

- Supported UTC instants: `1800-01-01` through `2200-12-31`.
- Every public angle is in degrees. Azimuth is clockwise from north.
- Event searches use explicit half-open UTC intervals: `[start, end)`.
- An interval may be at most 48 hours. The caller owns civil-time-zone and
  calendar-day conversion.
- Missing polar or grazing events are omitted; invalid dates are never
  fabricated.
- `altitude` is geometric center altitude. `apparentAltitude` additionally
  applies atmospheric refraction.

Semantic aliases such as `Degree`, `Radian`, `JulianDay`, `Kilometer`, `Meter`,
and `Millisecond` document unit contracts while remaining ordinary numbers at
runtime.

## Source organization

- `src/sun` owns the solar constants, types, ephemeris, positions, and events.
- `src/moon` owns the lunar constants, types, series, ephemeris, positions,
  illumination, phases, and events.
- `src/shared` contains only genuinely shared coordinate, time, mathematical,
  validation, and root-finding infrastructure, with an internal barrel entry
  point.
- Each directory keeps its constants in `consts.ts` and its contracts in
  `types.ts`; root `src/types.ts` contains only foundational units and inputs.

The public entry point exports the two domain barrels; internal implementation
modules are not package subpath exports.

## Example

```ts
import {
  findSunAzimuthCrossings,
  getMoonIllumination,
  getMoonPosition,
  getNextMoonPhases,
  getSunEvents,
  getSunPosition,
  type Observer,
  type UtcInterval
} from "moon-sun-calc";

const observer: Observer = {
  latitude: 51.5,
  longitude: -0.1,
  elevation: 24
};
const interval: UtcInterval = {
  start: Date.parse("2025-01-01T00:00:00Z"),
  end: Date.parse("2025-01-02T00:00:00Z")
};

const sun = getSunPosition({ instant: Date.now(), observer });
const moon = getMoonPosition({ instant: Date.now(), observer });
const illumination = getMoonIllumination(Date.now());
const events = getSunEvents({ interval, observer });
const phases = getNextMoonPhases(Date.now(), 4);

// There can be more than one solution in an interval.
const azimuthSolutions = findSunAzimuthCrossings({
  azimuth: 90,
  interval,
  observer
});
```

## Public API

- `getSunPosition({ instant, observer, options? })`
- `getMoonPosition({ instant, observer, options? })`
- `getMoonIllumination(instant)`
- `getNextMoonPhases(instant, count?)`
- `getSunEvents({ interval, observer, options? })`
- `getMoonEvents({ interval, observer, options? })`
- `findSunAltitudeCrossings({ altitude, interval, observer, options? })`
- `findSunAzimuthCrossings({ azimuth, interval, observer, options? })`
- `getMoonZenithAngle(brightLimbAngle, parallacticAngle)`

Position options may specify atmospheric pressure in hPa and temperature in
degrees Celsius. Event scans default to five-minute brackets and refine roots
to about 100 milliseconds; `options.step` can tune the bracket size.

See [ACCURACY.md](./ACCURACY.md) for model scope and fixtures, and
[MIGRATION.md](./MIGRATION.md) for the breaking 0.2 API changes.
