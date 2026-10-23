const DIAL_CENTER = 160;
const OUTER_TICK_RADIUS = 131;
// Compensate for the cropped SVG width to match the azimuth marker's rendered size.
const MARKER_SCALE = OUTER_TICK_RADIUS / DIAL_CENTER;

export const RISE_SET_WIDGET_CONFIG = {
	animation: {
		bodyDuration: 240,
		transitionDuration: 650
	},
	body: {
		belowHorizonOpacity: 0.5,
		scale: 1.35
	},
	colors: {
		moon: "hsl(207deg 66% 74%)",
		sun: "hsl(39deg 94% 61%)"
	},
	dial: {
		angleSpan: 180,
		angleStart: 270,
		center: DIAL_CENTER,
		guideGap: {
			horizontal: 36,
			vertical: 40
		},
		horizonRadius: 116,
		tick: {
			angleStep: 15,
			innerRadius: 125,
			majorEvery: 3,
			majorInnerRadius: 121,
			outerRadius: OUTER_TICK_RADIUS
		},
		viewBoxHeight: 208
	},
	layout: {
		maxWidth: "25rem"
	},
	marker: {
		glowSize: 5 * MARKER_SCALE,
		radius: 8 * MARKER_SCALE
	},
	midnight: {
		tickLength: 8,
		tickWidth: 1.5
	},
	track: {
		baseOpacity: 0.1,
		baseWidth: 2.5,
		progressOpacity: 0.65,
		progressWidth: 3.5,
		radius: 98
	}
} as const;
