export type BridgeName =
	| "alexander-nevsky"
	| "annunciation"
	| "exchange"
	| "bolsheokhtinsky"
	| "volodarsky"
	| "palace"
	| "liteyny"
	| "trinity"
	| "tuchkov"
	| "sampsonievsky"
	| "grenadersky"
	| "kantemirovsky";

export type BridgeSheduleEntry = Array<[
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
	bridges: Record<BridgeName, BridgeSheduleEntry>;
}

export interface BridgeState {
	name: BridgeName;
	open: boolean;
	timestamp: number;
}
