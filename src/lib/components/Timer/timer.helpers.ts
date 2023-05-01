/**
 * Corrects the time output for smaller values (below 10):
 * - 12 -> 12
 * - 5  -> 05
 */
const correctTimeNumber = (number: number) => {
	return number < 10
		? `${0}${number}`
		: number.toString();
};

/**
 * Calculates the number of seconds left until the given timestamp value.
 */
export const calcSecondsLeft = (timestamp: number) => {
	return Math.round((timestamp - new Date().getTime()) / 1000);
};

/**
 * Convert the number of seconds to HH:MM:SS format.
 */
export const formatTime = (seconds: number) => {
	const hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	return {
		hours: correctTimeNumber(hours),
		minutes: correctTimeNumber(minutes),
		seconds: correctTimeNumber(seconds)
	};
};
