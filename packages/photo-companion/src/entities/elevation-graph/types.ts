/**
 * Function that calculates the altitude for a given astro-object.
 */
export interface AltitudeInput {
	instant: DateLike;
	observer: {
		latitude: number;
		longitude: number;
	};
}

export type AltitudeGetter = (input: AltitudeInput) => {
	apparentAltitude: number;
};

export interface Tick {
	text: string;
	x: number;
	y: number;
}
