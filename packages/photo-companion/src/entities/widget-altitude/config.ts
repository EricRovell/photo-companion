const PLOT_LEFT = 52;
const PLOT_RIGHT = 584;
const PLOT_TOP = 32;
const PLOT_HEIGHT = 240;

export const ALTITUDE_WIDGET_CONFIG = {
	animation: {
		transitionDuration: 650
	},
	axis: {
		altitudePadding: 5,
		altitudeTickCount: 5,
		altitudeTickStep: 5,
		hourStep: 4,
		tickLabelOffset: 24,
		timeTitleOffset: 50,
		titleY: 12
	},
	chart: {
		height: 334,
		width: 600
	},
	colors: {
		moon: "hsl(207deg 66% 74%)",
		sun: "hsl(39deg 94% 61%)"
	},
	layout: {
		maxWidth: "42rem"
	},
	marker: {
		haloRadius: 11,
		radius: 5
	},
	path: {
		peakRefinementSteps: 24,
		sampleInterval: 5 * 60 * 1000
	},
	plot: {
		bottom: PLOT_TOP + PLOT_HEIGHT,
		height: PLOT_HEIGHT,
		left: PLOT_LEFT,
		right: PLOT_RIGHT,
		top: PLOT_TOP,
		width: PLOT_RIGHT - PLOT_LEFT
	},
	selection: {
		inactiveOpacity: 0.25
	}
} as const;
