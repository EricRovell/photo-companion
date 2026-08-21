import type {
	LocalLunarEclipse,
	LunarEclipseContact,
	LunarEclipseState
} from "moon-sun-calc";

import type { EclipseContactPosition } from "~/entities/eclipse";

export interface EclipseGraphPoint {
	x: number;
	y: number;
}

export interface LunarEclipseContactProps {
	code?: string;
	contact: LunarEclipseContact;
	label: string;
	position: EclipseContactPosition;
}

export interface LunarEclipseDetailsProps {
	event: LocalLunarEclipse | null;
	state: LunarEclipseState;
}

export interface LunarEclipseGraphProps {
	event: LocalLunarEclipse | null;
	latitude: number;
	longitude: number;
	state: LunarEclipseState;
}

export type LunarEclipseDirection = "next" | "previous";
