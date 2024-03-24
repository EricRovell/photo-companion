# Bridge Schedule

Saint Petersburg, Russia drawbridges schedule provider.

## Schema

The bridges schedule data schema:

```ts
export type BridgeSchedule = Array<[
	hoursOpen: number,
	minutesOpen: number,
	hoursClose: number,
	minutesClose: number
]>;

export interface NavigationSchedule {
	// the date the schedule was updated
	year: number;
	// the navigation period dates
	navigation: [
		monthStart: number,
		dateStart: number,
		monthEnd: number,
		dateEnd: number
	],
	exception: Array<BridgeName>;
	schedule: Record<BridgeName, BridgeSchedule>;
}
```

These list of supported drawbridges are available as `SUPPORTED_BRIDGES_NAME_SET` variable.

```ts
type BridgeName =
	| "ALEXANDER_NEVSKY"
	| "ANNUNCIATION"
	| "EXCHANGE"
	| "BOLSHEOKHTINSKY"
	| "VOLODARSKY"
	| "PALACE"
	| "LITEYNY"
	| "TRINITY"
	| "TUCHKOV"
	| "SAMPSONIEVSKY"
	| "GRENADERSKY"
	| "KANTEMIROVSKY";
```

## API

### `isNavigationTime(date?: Date): boolean`

Drawbridges are functional within a so called navigation period when the rivers are not frozen. `isNavigationTime` provides a convenient way to check is the drawbridges are operational or not for a given date. The current date is used as fallback.

```ts
import { isNavigationTime } from "bridges-schedule";

const check = isNavigationTime();
```

### `getNavigationState(date?: Date): { navigation: boolean, days: number }`

Returns a navigation state for a given date: is navigation is open and how many days there are till the navigation opens or closed. The current date is used as fallback.

```ts
import { getNavigationState } from "bridge-schedule";

const state = getNavigationState();
```

### `getBridgeState(name: BridgeName, date?: Date, ignoreNavigationSchedule?: true): BridgeState;`

Returns a bridge state by a given date. The navigation period is taken into account.

`ignoreNavigationSchedule` option let's the function ignore the navigation period as if the bridges were operational throughout the year.

The current date is used as fallback.

```ts
import { getBridgeState } from "bridge-schedule";

interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}

const state = getBridgeState("ALEXANDER_NEVSKY");
```

### `getBridgeScheduleEntry(name: BridgeName): BridgeScheduleEntry`

Returns a schedule entry data for a specific bridge.

```ts
import { getBridgeScheduleEntry } from "bridge-schedule";

const scheduleEntry = getBridgeScheduleEntry("ALEXANDER_NEVSKY");
```

### `getNextBridgeEvent(date?): BridgeState`

Returns the closest bridge event from the given date. The current date is used as fallback.

```ts
import { getNextBridgeEvent } from "bridge-schedule";

interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}

const event = getNextBridgeEvent();
```

### `function getBridgeEvents(date?): BridgeEvent[]`

Returns all bridge events occurred at the given date. The current date used as fallback.

Note: Bridge events **only** available during navigation.

```ts
import { getBridgeEvents } from "bridge-schedule";

const events = getBridgeEvents();
```

### `isBridgeException(name: BridgeName): boolean`

Some drawbridges has non-permanent schedule. The `isBridgeException` provides a way to check is the given bridge should be considered as such an exception.
