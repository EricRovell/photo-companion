# Lights Schedule

City lights schedule provider. Official schedule data is used where available; other locations can use an explicitly labelled solar estimate.

Official schedules are bundled for:

- Saint-Petersburg, Russia;
- Moscow, Russia;

## Schedule schema

```ts
export interface CityLightsSchedule {
	year: number;
	city: LightsCity;
	schedule: number[];
	getter: (date: Date) => number;
}
```

The `schema` is an array of integer values where each 4 numbers represent a schedule data for a specific day as:

```js
[
	hours_on, minutes_on, hours_off, minutes_off, // 1st Jan
	hours_on, minutes_on, hours_off, minutes_off, // 2nd Jan
	hours_on, minutes_on, hours_off, minutes_off, // 3rd Jan
	...
]
```

The `getter` is a function that returns the first index of these 4 indices for a given date.

### The reasoning

*Why the schedule is just an array and not 2D array?*

That's to save some space. As we know that each day schedule represents a tuple of 4 entries, it does not complicates a code too much.

*Why do we need a getter?*

The main reason is — to save some space. The schedule data varies from city to city. In some cities the schedule changes every day, in others every several days.

## API

To create an schedule provider, pass a supported city:

```ts
import { initLightsProvider } from "lights-schedule";

const provider = initLightsProvider("MOSCOW");
```

For another location, pass `OTHER` and its coordinates:

```ts
const provider = initLightsProvider("OTHER", {
	latitude: 52.52,
	longitude: 13.405
});
```

The provider exposes the information and methods to work with schedule data:

```ts
interface LightsProvider {
	city: City;
	getEventsByDate: (input?: Date) => LightsEvent[];
	getScheduleByDate: (input?: Date) => LightsSchedule;
	getStateByDate: (input?: Date) => IlluminationState;
	source: "SCHEDULE" | "SOLAR_ESTIMATE";
	year: number | null;
}
```

### `getScheduleByDate(input?: Date): LightsEvent[]`

Returns the lights schedule for a given date.

```ts
import { initLightsProvider } from "lights-schedule";

interface LightsSchedule {
	duration: number | null;
	LIGHTS_START: number | null;
	LIGHTS_END: number | null;
	source: "SCHEDULE" | "SOLAR_ESTIMATE";
	status: "SCHEDULED" | "CONTINUOUS_DAYLIGHT" | "CONTINUOUS_DARKNESS" | "UNAVAILABLE";
	uncertaintyMinutes: number;
}

const { getScheduleByDate } = initLightsProvider("MOSCOW");
const schedule = getScheduleByDate();
```

### `getStateByDate(input?: Date): IlluminationState`

Returns the state for current moment and a time till the next event.

```ts
import { initLightsProvider } from "lights-schedule";

type LightsEventName =
	| "LIGHTS_START"
	| "LIGHTS_END";

interface IlluminationState {
	lights: boolean;
	event: LightsEventName | null;
	timestamp: number | null;
}

const { getStateByDate } = initLightsProvider("MOSCOW");
const state = getStateByDate();
```

### `getEventsByDate(input: Date = new Date()): LightsEvent[]`

Returns all the lights schedule events for a given date.

```ts
import { initLightsProvider } from "lights-schedule";

const { getEventsByDate } = initLightsProvider("MOSCOW");
const events = getEventsByDate();
```

## Solar estimate

The estimate switches lights on and off when the Sun crosses event-specific effective altitudes. Those altitudes are calculated from the date and latitude with a compact two-harmonic annual model fitted to the bundled Moscow and Saint Petersburg schedules. The same coordinate/date formula is used for every city; there are no hidden city schedule lookups.

The annual phase is shifted by six months in the Southern Hemisphere, and its effect tapers to zero at the equator. Latitude adjustment is clamped outside the 55.76–59.93° calibration range rather than extrapolating an increasingly unreliable fit. The seasonal model reduced mean error against the two bundled 2024 schedules from about 8.4 to 3.5 minutes for switch-on and from 11.4 to 3.9 minutes for switch-off. This is calibration accuracy, not a guarantee for other cities.

Estimated times have an uncertainty of ±30 minutes, increased to ±60 minutes at absolute latitudes of 63° or more. Actual operation can differ due to local policy, weather sensors, maintenance modes, and energy-saving rules.

When the Sun never crosses the thresholds, the result has a
`CONTINUOUS_DAYLIGHT` or `CONTINUOUS_DARKNESS` status, `null` event times, and no timeline events. Missing or invalid coordinates produce `UNAVAILABLE` rather than silently falling back to another city's official schedule.

## Cities

### Saint-Petersburg, Russia

[Schedule source][lights-schedule-source-spb]

Illumination schedule for Saint-Petersburg, Russia has some repetitive structure, that will be used to *compress* the data.

What can be noticed is that the schedule changes every 5 days. Each month has the same date-ranges with the same schedule: 1-5, 6-10, 11-15, 16-20, 21-25, 26-.... This way each month is broken into 6 parts and we can get the right part by division by 5 (31 should be handled).

All the data is represented as an array with repetitive data as `[ ..., hours_on, minutes_on, hours_off, minutes_off, ... ]`, where the time range is stored.

So, how do we get the right data?

1. Imagine that every 4 items makes a new row;
2. The dataset has 6 rows for each month. The month number can give us the starting row as `(month * 6 - 6)` (taking 0-index into account);
3. The date should give as the offset required to get to the right row as `min((date - 1) // 5, 5)`, where `//` is integer division and `min` function used as the last range can be `26-31` for example;
4. As there are not real rows, we get the "imaginary" row using the fact that there are 4 items per collection we get index as such `row => row * 4`, and the next four items is the data we need.

Overall:

```ts
function getSchedule(month: number, date: number, data: number[]): number[] {
	const row = (month * 6 - 6) + Math.min(Math.floor((date - 1) / 5), 5);
	const index = row * 4;
	return data.slice(index, index + 4);
}
```

### Moscow, Russia

[Schedule source][lights-schedule-source-moscow]

Moscow lights schedule is quite straightforward: schedule changes every day.

[lights-schedule-source-spb]: https://lensvet.spb.ru/grafik_raboty_naruzhnogo_osvescheni/
[lights-schedule-source-moscow]: https://domdata.ru/osveschenie-v-moskve
