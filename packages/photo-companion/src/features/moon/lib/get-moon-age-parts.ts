const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;

interface MoonAgeParts {
	days: number;
	hours: number;
	minutes: number;
}

export function getMoonAgeParts(age: number): MoonAgeParts {
	const totalMinutes = Math.round(age * MINUTES_PER_DAY);

	return {
		days: Math.floor(totalMinutes / MINUTES_PER_DAY),
		hours: Math.floor(totalMinutes % MINUTES_PER_DAY / MINUTES_PER_HOUR),
		minutes: totalMinutes % MINUTES_PER_HOUR
	};
}
