/**
 * Returns a part of ISO string (removes all data after minutes) for an datetime input.
 */
export function getDateTimeString(date: DateLike = new Date()): string {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	const timezoneOffset = date.getTimezoneOffset() * 60000;
	return (new Date(date.getTime() - timezoneOffset)).toISOString().slice(0, 16);
}

const REPLACE_REGEX = /T|:/g;
const DELIMITER = "-";

/**
 * Parses the datetime sting in format YYYY-MM-DDThh:mm into YYYY-MM-DD-hh-mm.
 */
export function parseDateTimeString(input: string): string {
	return input.replace(REPLACE_REGEX, DELIMITER);
}
