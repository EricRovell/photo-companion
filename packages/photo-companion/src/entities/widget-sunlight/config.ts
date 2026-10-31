export const SUNLIGHT_WIDGET_CONFIG = {
	animation: {
		transitionDuration: 650
	},
	dial: {
		center: 160,
		eventTickHalfLength: 4,
		horizonRadius: 116,
		labelRadius: 145,
		majorTickRadius: 121,
		markerHeight: 10,
		markerWidth: 10,
		segmentDividerHalfLength: 2.5,
		tickRadius: 125,
		tickRadiusOuter: 131,
		trackRadius: 98,
		viewBoxSize: 320
	},
	phases: [
		"daylight",
		"golden",
		"blue",
		"civil",
		"nautical",
		"astronomical",
		"night"
	]
} as const;
