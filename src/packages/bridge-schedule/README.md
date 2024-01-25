# Bridges

## Saint-Petersburg, Russia

The bridges shedule data has such an interface:

```ts
export type BridgeShedule = Array<[
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
	shedule: Record<BridgeName, BridgeShedule>;
}
```
