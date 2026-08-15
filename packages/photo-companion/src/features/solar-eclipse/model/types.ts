import type {
	LocalSolarEclipse,
	SolarEclipseContact,
	SolarEclipseState
} from "moon-sun-calc";

export interface EclipseGraphPoint {
	x: number;
	y: number;
}

export interface SolarEclipseContactProps {
	contact: SolarEclipseContact;
	label: string;
	position: SolarEclipseContactPosition;
}

export interface SolarEclipseDetailsProps {
	event: LocalSolarEclipse | null;
	obscuration: number;
}

export interface SolarEclipseGraphProps {
	event: LocalSolarEclipse | null;
	latitude: number;
	longitude: number;
	state: SolarEclipseState;
}

export interface SolarEclipseNavigationProps {
	onNext: () => void;
	onPrevious: () => void;
}

export type SolarEclipseDirection = "next" | "previous";
export type SolarEclipseContactPosition = "begin" | "end" | "peak";
