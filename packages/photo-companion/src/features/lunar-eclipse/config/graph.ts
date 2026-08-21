export const GRAPH_CONFIG = {
	altitudeTicks: [ -1.5, -1, -0.5, 0.5, 1, 1.5 ],
	azimuthTicks: [ -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5 ],
	trackHalfSpan: 12 * 60 * 60 * 1000,
	trackSegments: 96,
	viewAltitudeRadius: 1.65,
	viewAzimuthRadius: 1.65 * 16 / 9
} as const;
