import type {
	DateLike,
	Degree,
	Fraction,
	Millisecond,
	Observer
} from "../types";

export type SolarEclipseKind = "ANNULAR" | "PARTIAL" | "TOTAL";
export type SolarEclipsePhase = "NONE" | SolarEclipseKind;
export type SolarEclipseVisibility = "FULL" | "NONE" | "PARTIAL";

export interface SolarEclipseInput {
	instant: DateLike;
	observer: Observer;
}

export interface SolarEclipseSearchInput extends SolarEclipseInput {
	visibleOnly: boolean;
}

export interface NearbySolarEclipseInput extends SolarEclipseInput {
	/** Time before C1 and after C4 in which the local eclipse is considered nearby. */
	margin: Millisecond;
}

export interface SolarEclipseBodyState {
	altitude: Degree;
	angularRadius: Degree;
	apparentAltitude: Degree;
	azimuth: Degree;
}

export interface SolarEclipseMoonState extends SolarEclipseBodyState {
	offset: {
		altitude: Degree;
		azimuth: Degree;
	};
}

export interface SolarEclipseState {
	moon: SolarEclipseMoonState;
	obscuration: Fraction;
	phase: SolarEclipsePhase;
	separation: Degree;
	sun: SolarEclipseBodyState;
}

export interface SolarEclipseContact {
	sunAltitude: Degree;
	sunAzimuth: Degree;
	time: Date;
	visible: boolean;
}

export interface LocalSolarEclipse {
	kind: SolarEclipseKind;
	obscuration: Fraction;
	partialBegin: SolarEclipseContact;
	partialEnd: SolarEclipseContact;
	peak: SolarEclipseContact;
	visibility: SolarEclipseVisibility;
}
