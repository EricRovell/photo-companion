/**
 * Function that calculates the altitude for a given astro-object.
 */
export type AltitudeGetter = (date: DateLike, latitude: number, longitude: number, degrees: boolean) => {
	altitude: number;
};

export interface Tick {
	text: string;
	x: number;
	y: number;
}
