export type BridgeName =
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

export type BridgeScheduleEntry = Array<[
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
	bridges: Record<BridgeName, BridgeScheduleEntry>;
}

export interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}
