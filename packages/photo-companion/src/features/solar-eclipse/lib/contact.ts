import type { SolarEclipseContactPosition } from "../model/types";

const SECOND_MS = 1000;

export function getSolarEclipseContactLinkTime(
	time: Date,
	position: SolarEclipseContactPosition
): Date {
	const timestamp = time.getTime();
	const linkTimestamp = position === "begin"
		? Math.ceil(timestamp / SECOND_MS) * SECOND_MS
		: Math.floor(timestamp / SECOND_MS) * SECOND_MS;

	return new Date(linkTimestamp);
}
