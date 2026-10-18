export type AzimuthEntity = "moon" | "sun";

export interface AzimuthWidgetFormatters {
	ariaEntity: (label: string, azimuth: number) => string;
	list: (values: string[]) => string;
}

export interface AzimuthPathPoint {
	altitude: number;
	azimuth: number;
}

export interface AzimuthWidgetEntity {
	altitude: number;
	azimuth: number;
	id: AzimuthEntity;
	label: string;
	path: AzimuthPathPoint[];
}

export interface AzimuthWidgetLabels {
	align: string;
	alignBlocked: string;
	alignDenied: string;
	alignTimeout: string;
	alignUnavailable: string;
	altitude: string;
	azimuth: string;
	celestialBody: string;
	east: string;
	north: string;
	south: string;
	west: string;
}

export interface CardinalLabels {
	east: string;
	north: string;
	south: string;
	west: string;
}
