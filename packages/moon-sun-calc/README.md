# MoonSunCalc

MoonSunCalc is a tiny TypeScript library for the Sun and the Mun calculations.

## API

### The Sun

<details>
	<summary>
		<code>getSunPosition(date: DateLike, latitude: number, longitude: number, degrees = false): SunPosition</code>
	</summary>

Calculates the Sun position for a given date and geoposition coordinates. The output is in radians by default.

```ts
interface SunPosition {
	altitude: number;
	azimuth: number;
	declination: number;
	zenith: number;
}
```
</details>

<details>
	<summary>
		<code>getSunTime(date: DateLike, latitude: number, longitude: number, elevationAngle: number, options: Options = {}): SunTimeByElevation</code>
	</summary>

Calculates the time at which the sun will have a given elevation angle when rising and when setting for a given date and geoposition. The observer `height` (in meters) relative to the horizon can be specified via options. The elevation angle input is in radians by default.

```ts
interface Options {
	height?: number;
	degrees?: boolean;
}

interface SunTimeByElevation {
	set: SunTime;
	rise: SunTime;
}

interface SunTime {
	/**
	 * Note: exception for `SOLAR_NOON` & `NADIR`
	 */
	elevation?: number;
	julian: number;
	index: number;
	name: string;
	timestamp: number;
	valid: boolean;
}
```
</details>

<details>
	<summary>
		<code>getSunTimeByAzimuth(dateValue: DateLike, latitude: number, longitude: number, azimuth: number, degree = false): Date</code>
	</summary>

Calculates a sun time for a given azimuth angle for a given date and geoposition. The `azimuth` input value is in radians by default.
</details>

<details>
	<summary>
		<code>getSunTimes(date: DateLike, latitude: number, longitude: number, options: Options = {}): Record<SunEventName, SunTime></code>
	</summary>

Calculates sun times for a given date and geoposition.

```ts
type SunEventName =
	| "SOLAR_NOON"
	| "NADIR"
	| "GOLDEN_HOUR_START_DAWN"
	| "GOLDEN_HOUR_END_DAWN"
	| "GOLDEN_HOUR_START_DUSK"
	| "GOLDEN_HOUR_END_DUSK"
	| "SUNRISE_START"
	| "SUNRISE_END"
	| "SUNSET_START"
	| "SUNSET_END"
	| "BLUE_HOUR_START_DAWN"
	| "BLUE_HOUR_END_DAWN"
	| "BLUE_HOUR_START_DUSK"
	| "BLUE_HOUR_END_DUSK"
	| "CIVIL_DAWN"
	| "CIVIL_DUSK"
	| "NAUTICAL_DAWN"
	| "NAUTICAL_DUSK"
	| "ASTRONOMICAL_DAWN"
	| "ASTRONOMICAL_DUSK";

interface SunTime {
	/**
	 * Note: exception for `SOLAR_NOON` & `NADIR`
	 */
	elevation?: number;
	julian: number;
	index: number;
	name: string;
	timestamp: number;
	valid: boolean;
}
```
</details>

### The Moon

<details>
	<summary>
		<code>getMoonPhases(date: DateLike): MoonPhase[]</code>
	</summary>

Calculates the nearest moon phases from the given date.

```ts
interface MoonPhase {
	phaseName: MoonPhaseName;
	phaseValue: number;
	timestamp: number;
}

type MoonPhaseName =
	| "NEW_MOON"
	| "WAXING_CRESCENT"
	| "FIRST_QUARTER"
	| "WAXING_GIBBOUS"
	| "FULL_MOON"
	| "WANING_GIBBOUS"
	| "THIRD_QUARTER"
	| "WANING_CRESCENT";
```
</details>

<details>
	<summary>
		<code>getMoonIllumination(dateValue: DateLike, degrees = false): MoonIllumination</code>
	</summary>

Calculates the illumination parameters of the Moon. The output angle values are in radians by default.

```ts
interface MoonIllumination {
	/**
	 * The midpoint angle in radians of the illuminated limb of the moon
	 * reckoned eastward from the north point of the disk;
	 */
	angle: number;
	fraction: number;
	phase: MoonPhase;
	phaseValue: number;
}
```
</details>

<details>
	<summary>
		<code>getMoonPosition(dateValue: DateLike, latitude: number, longitude: number, degrees = false): MoonPosition</code>
	</summary>

Calculates moon position for a given date and geoposition. The output angle values are in radians by default.

```ts
interface MoonPosition {
	azimuth: number;
	altitude: number;
	distance: number;
	parallacticAngle: number;
}
```
</details>

<details>
	<summary>
		<code>getMoonTimes(dateValue: DateLike, latitude: number, longitude: number, inUTC = false): MoonTimes</code>
	</summary>

Calculates the moon rise and set times for a given date and geoposition. Local time is used by default.

```ts
export interface MoonTimes {
	rise: Nullish<Date>;
	set: Nullish<Date>;
	alwaysUp: boolean;
	alwaysDown: boolean;
	/**
	 * Date of the highest position.
	 * Available if `set` and `rise` is not `null`.
	 */
	highest?: Date;
}
```
</details>
