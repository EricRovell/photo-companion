export const GRAPH_CONFIG = {
	altitudeTicks: [ -0.5, 0.5 ],
	azimuthTicks: [ -1.5, -1, -0.5, 0.5, 1, 1.5 ],
	trackHalfSpan: 12 * 60 * 60 * 1000,
	trackSegments: 96,
	viewAltitudeRadius: 1,
	viewAzimuthRadius: 16 / 9
} as const;
