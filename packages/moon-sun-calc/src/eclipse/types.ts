import type {
	DateLike,
	Degree,
	Fraction,
	Millisecond,
	Observer
} from "../types";

export type SolarEclipseType = "ANNULAR" | "PARTIAL" | "TOTAL";
export type SolarEclipsePhase = "NONE" | SolarEclipseType;
export type EclipseVisibility = "FULL" | "NONE" | "PARTIAL";
export type SolarEclipseVisibility = EclipseVisibility;

export type LunarEclipseType = "PARTIAL" | "PENUMBRAL" | "TOTAL";
export type LunarEclipseNoticeability = "CLEAR" | "SUBTLE" | "UNLIKELY";
export type LunarEclipsePhase = "NONE" | LunarEclipseType;
export type LunarEclipseVisibility = EclipseVisibility;

export interface SolarEclipseInput {
	instant: DateLike;
	observer: Observer;
}

export interface LunarEclipseInput {
	instant: DateLike;
	observer: Observer;
}

export interface LunarEclipseSearchInput extends LunarEclipseInput {
	visibleOnly: boolean;
}

export interface NearbyLunarEclipseInput extends LunarEclipseInput {
	/** Time before P1 and after P4 in which the lunar eclipse is considered nearby. */
	margin: Millisecond;
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

export interface LunarEclipseMoonState extends SolarEclipseBodyState {
	offset: {
		altitude: Degree;
		azimuth: Degree;
	};
}

export interface LunarEclipseShadowState {
	altitude: Degree;
	apparentAltitude: Degree;
	azimuth: Degree;
	penumbraAngularRadius: Degree;
	umbraAngularRadius: Degree;
}

export interface LunarEclipseState {
	moon: LunarEclipseMoonState;
	penumbralMagnitude: number;
	phase: LunarEclipsePhase;
	separation: Degree;
	shadow: LunarEclipseShadowState;
	umbralCoverage: Fraction;
	umbralMagnitude: number;
}

export interface LunarEclipseContact {
	moonAltitude: Degree;
	moonAzimuth: Degree;
	time: Date;
	visible: boolean;
}

export interface LocalLunarEclipse {
	noticeability: LunarEclipseNoticeability;
	partialBegin: LunarEclipseContact | null;
	partialEnd: LunarEclipseContact | null;
	peak: LunarEclipseContact;
	penumbralBegin: LunarEclipseContact;
	penumbralEnd: LunarEclipseContact;
	penumbralMagnitude: number;
	totalBegin: LunarEclipseContact | null;
	totalEnd: LunarEclipseContact | null;
	type: LunarEclipseType;
	umbralMagnitude: number;
	visibility: LunarEclipseVisibility;
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
	obscuration: Fraction;
	partialBegin: SolarEclipseContact;
	partialEnd: SolarEclipseContact;
	peak: SolarEclipseContact;
	type: SolarEclipseType;
	visibility: SolarEclipseVisibility;
}
