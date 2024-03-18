/**
 * Function that calculates the altitude for a given astro-object.
 */
export type AltitudeGetter = ( date: Date | number, latitude: number, longitude: number, degrees: boolean) => {
	altitude: number;
};

export interface GraphEntry {
	className?: string;
	id: string;
	getAltitude: AltitudeGetter;
	// Note: the reason is that Safari does not support "r" attribute via CSS
	pointerSize?: number;
}

export interface Tick {
	x: number;
	y: number;
	text: string;
}
