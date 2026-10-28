interface AltitudeObserver {
	latitude: number;
	longitude: number;
}

export interface AltitudeEntity {
	getPosition: (input: {
		instant: DateLike;
		observer: AltitudeObserver;
	}) => { apparentAltitude: number };
	id: "moon" | "sun";
	label: string;
}

export interface AltitudeWidgetProps extends AltitudeObserver {
	date: Date;
	entities: AltitudeEntity[];
	title: string;
}

export interface AltitudePoint {
	altitude: number;
	timestamp: number;
}

export interface AltitudeRange {
	max: number;
	min: number;
}

export interface AltitudeChartFrame {
	current: Map<AltitudeEntity["id"], number>;
	cursorX: number;
	day: {
		end: number;
		start: number;
	};
	range: AltitudeRange;
	series: Map<AltitudeEntity["id"], AltitudePoint[]>;
}
