import type { JSXElement } from "solid-js";

export interface ViewProps {
	children: JSXElement;
}

/**
 * Function that calculates the altitude for a given astro-object.
 */
export type AltitudeGetter = ( date: DateLike, latitude: number, longitude: number, degrees: boolean) => {
	altitude: number;
};

export interface GraphEntityProps {
	class?: string;
	date: Date;
	id: string;
	getAltitude: AltitudeGetter;
	// Note: the reason is that Safari does not support "r" attribute via CSS
	pointerSize?: number;
}

export interface GraphProps {
	date?: Date;
	entries: Omit<GraphEntityProps, "date">[];
}

export interface Tick {
	x: number;
	y: number;
	text: string;
}
