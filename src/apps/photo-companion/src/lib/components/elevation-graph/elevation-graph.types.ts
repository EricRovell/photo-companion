/**
 * Function that calculates the altitude for a given astro-object.
 */
export type AltitudeGetter = (date: Date | number, latitude: number, longitude: number) => {
	altitudeDegrees: number;
};

export interface GraphEntry {
	className?: string;
	id: string;
	getAltitude: AltitudeGetter;
}

export interface Tick {
	x: number;
	y: number;
	text: string;
}
