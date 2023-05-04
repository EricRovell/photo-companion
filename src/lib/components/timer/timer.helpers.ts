/**
 * Breaks a 2-digit number into 2 digits.
 */
const toDigits = (number: number): number[] => {
	if (number < 10) {
		return [ 0, number ];
	}

	return [ Math.floor((number / 10) % 10), number % 10 ];
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
		hours: toDigits(hours),
		minutes: toDigits(minutes),
		seconds: toDigits(seconds)
	};
};
