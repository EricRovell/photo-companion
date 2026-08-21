const SECOND_MS = 1000;

export type EclipseContactPosition = "begin" | "end" | "peak";

export function getEclipseContactLinkTime(time: Date, position: EclipseContactPosition): Date {
	const timestamp = time.getTime();
	const linkTimestamp = position === "begin"
		? Math.ceil(timestamp / SECOND_MS) * SECOND_MS
		: Math.floor(timestamp / SECOND_MS) * SECOND_MS;

	return new Date(linkTimestamp);
}
