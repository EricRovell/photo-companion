export type BridgeName =
	| "ALEXANDER_NEVSKY"
	| "ANNUNCIATION"
	| "BOLSHEOKHTINSKY"
	| "EXCHANGE"
	| "GRENADERSKY"
	| "KANTEMIROVSKY"
	| "LITEYNY"
	| "PALACE"
	| "SAMPSONIEVSKY"
	| "TRINITY"
	| "TUCHKOV"
	| "VOLODARSKY";

// eslint-disable-next-line @typescript-eslint/array-type
export type BridgeScheduleEntry = Array<[
	hoursOpen: number,
	minutesOpen: number,
	hoursClose: number,
	minutesClose: number
]>;

export interface NavigationSchedule {
	bridges: Record<BridgeName, BridgeScheduleEntry>;
	exception: BridgeName[];
	// the navigation period dates
	navigation: [
		monthStart: number,
		dateStart: number,
		monthEnd: number,
		dateEnd: number
	],
	// the date the schedule was updated
	year: number;
}

export interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}
