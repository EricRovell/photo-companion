export function getTimestampFromTime(date: Date, hours: number, minutes: number): number {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		hours,
		minutes,
		0,
		0
	).getTime();
}
