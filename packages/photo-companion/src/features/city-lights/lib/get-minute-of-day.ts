export function getMinuteOfDay(timestamp: number): number {
	const date = new Date(timestamp);
	return date.getHours() * 60 + date.getMinutes();
}
