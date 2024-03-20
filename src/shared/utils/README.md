# Utils

Project's core utility functions.

## Common

### `padWithZero(number: number): string`

Pads with zero a numeric value if it is less than 10.

```ts
import { padWithZero } from "utils";

padWithZero(1) // -> "01"
padWithZero(15) // -> "15"
```

### `objectEntries<T extends object>(obj: T): Entries<T>`

Same as `Object.entries()` but with type inference

## Date

### `calcDuration(from: Nullish<DateLike> = null, to: Nullish<DateLike> = null): number`

Calculates the duration in ms between two dates in seconds.

Used to get the duration of specific event occurred within one day:

1. Both dates are provided, returns the difference;
2. `from` is not specified - the starting point is the beginning of the same day as the `to` date;
3. `to` is not specified - the ending point is the beginning of the next day after the `from` date;

```ts
import { calcDuration } from "utils/date";

const from = new Date(2021, 1, 2, 12);
const to = new Date(2021, 1, 2, 14);

calcDuration(a, b) // -> 7_200_000
```

### `countDays(from: DateLike, to: DateLike)`

Count the number of dates between two given dates. The result is ceiled.

```ts
import { countDays } from "utils/date";

const from = new Date(2021, 1, 2);
const to = new Date(2021, 1, 5);

countDays(a, b) // -> 3
```

### `dateFrom(input: DateLike = new Date(), options: DateFromOptions = {}): Date`

Returns a new date from a given date with predefined parameters.

Note: `month` is 1-indexed and the ms is set to 0 by default.

```ts
import { dateFrom } from "utils/date";

interface DateFromOptions {
	year?: number;
	month?: number;
	date?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

dateFrom(new Date(2021, 5, 3), { month: 1 }) // -> "2021-01-03"
```

### `incrementDateByDay(date: DateLike | string, dayCount: number): Date`

Increments the given date by number of days.

```ts
import { incrementDateByDay } from "utils/date";

incrementDateByDay(new Date(2021, 5, 3), 2) // -> "2021-06-05"
incrementDateByDay(new Date(2021, 5, 3), -1) // -> "2021-06-02"
```

### `isLeapYear(year: number): boolean`

Checks the given year for a leap year.

```ts
import { isLeapYear } from "utils/date";

isLeapYear(2023) // -> false
isLeapYear(2024) // -> true
```

### `isSameDay(a: DateLike, b: DateLike, UTC = false)`

Checks if two given date instances points to the same date.

```ts
import { isSameDay } from "utils/date";

const a = new Date(2021, 1, 2, 12);
const a = new Date(2021, 1, 2, 14);
const a = new Date(2021, 1, 3, 14);

isSameDay(a, b) // -> true
isSameDay(a, c) // -> false
```

## Formatters

### `formatDegrees(input: number, locale = "ru"): string`

Formats a value as a degree unit.

```ts
import { formatDegrees } from "utils/formatters";

formatDegrees(12); // -> "12°"
```

### `formatDuration(input: number, locale = "ru"): string`

Formats a number of ms into a countdown in format HH:MM:SS.

Note: `formatTime` is not a good option, as it uses local timezone, hence wrong results.

```ts
import { formatDuration } from "utils/formatters";

formatDuration(3600000); // -> "01:00:00"
```

### `formatKilometers(input: number, locale = "ru"): string`

Formats a numeric value into kilometers unit.

```ts
import { formatKilometers } from "utils/formatters";

formatKilometers(12); // -> "12 km"
```

### `formatPercent(input: number, locale = "ru"): string`

Formats a numeric value into % unit.

```ts
import { formatPercent } from "utils/formatters";

formatPercent(12); // -> "12%"
```

### `formatTime(input: Nullish<DateLike>, locale = "ru"): string`

Formats a date into HH:MM:SS time string format.

```ts
import { formatTime } from "utils/formatters";

formatTime(new Date(2021, 1, 1, 12, 45, 56)); // -> "12:45:56"
```

### `formatTimeShort(input: Nullish<DateLike>, locale = "ru"): string`

Formats a date into HH:MM time string format.

```ts
import { formatTimeShort } from "utils/formatters";

formatTimeShort(new Date(2021, 1, 1, 12, 45, 56)); // -> "12:45"
```

### `template(input: string, dict: Record<string, string | number>, regex = /{(.*?)}/g): string`

Replaces the entries within the string in curly braces (can be specified via regex parameter) with values in object.

In case no replacement is provided, the capture leaves as it is, just curly braces are removed.

```ts
import { template } from "utils/formatters";

template("Hello, {name}!", { name: "Peter" }) // -> "Hello, Peter!"
template("Hello, {name}!", {}) // -> "Hello, name!"
```

## Math

### `round(number: number, digits = 0, base?: number): number`

Round the number up to the desired precision.

```ts
import { round } from "utils/math";

round(1.126, 1) // -> 1.1
round(1.126, 2) // -> 1.13
```

### `scale(value: number, inLow: number, inHigh: number, outLow: number, outHigh: number): number`

Scales the value from a given [ inLow, inHigh ] range to [ outLow, outHight ].

```ts
import { scale } from "utils/math";

scale(0.5, 0, 1, 0, 10) // -> 5
```

## Validators

All the validators are available at `utils/validators`:

- `isInteger`;
- `isLatitude`;
- `isLongitude`;
- `isNonNegativeInteger`;
- `isNullable`;
- `isNonNullable`;
- `isValidDate`;
