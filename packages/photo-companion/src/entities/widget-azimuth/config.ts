const DIAL_CENTER = 160;
const HORIZON_RADIUS = 116;

export const AZIMUTH_WIDGET_CONFIG = {
	animation: {
		headingDuration: 240,
		transitionDuration: 650
	},
	dial: {
		cardinalRadius: 145,
		center: DIAL_CENTER,
		centerPointRadius: 2.5,
		guideEnd: DIAL_CENTER + HORIZON_RADIUS,
		guideStart: DIAL_CENTER - HORIZON_RADIUS,
		horizonRadius: HORIZON_RADIUS,
		tick: {
			angleStep: 15,
			count: 24,
			innerRadius: 125,
			majorEvery: 6,
			majorInnerRadius: 121,
			outerRadius: 131
		},
		viewBoxSize: DIAL_CENTER * 2
	},
	marker: {
		radius: 8
	},
	path: {
		sampleCount: 97
	},
	track: {
		radius: {
			moon: 80,
			sun: 98
		}
	}
} as const;
