export interface ScheduleDataItem {
	lights: boolean;
	timestamp: number
}

export type ScheduleRawData = [
	month: number,
	dateFrom: number,
	dateTo: number,
	hoursOff: number,
	minutesOff: number,
	hoursOn: number,
	minutesOn: number
];
