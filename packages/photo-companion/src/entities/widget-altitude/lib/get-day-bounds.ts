export function getDayBounds(date: Date) {
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);
	const end = new Date(start);
	end.setDate(end.getDate() + 1);

	return {
		end: end.getTime(),
		start: start.getTime()
	};
}
