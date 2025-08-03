interface DateParams {
	date: number
	hours: number
	milliseconds: number
	minutes: number
	month: number
	seconds: number
	year: number,
}

export function getDate({ date, hours, milliseconds, minutes, month, seconds, year }: Partial<DateParams>) {
	const now = new Date();

	if (typeof year === "number") {
		now.setFullYear(year);
	}

	if (typeof month === "number") {
		now.setMonth(month);
	}

	if (typeof date === "number") {
		now.setDate(date);
	}

	if (typeof hours === "number") {
		now.setHours(hours);
	}

	if (typeof minutes === "number") {
		now.setMinutes(minutes);
	}

	if (typeof seconds === "number") {
		now.setSeconds(seconds);
	}

	if (typeof milliseconds === "number") {
		now.setMilliseconds(milliseconds);
	}

	return now;
}
