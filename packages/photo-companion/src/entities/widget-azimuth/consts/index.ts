import { AZIMUTH_WIDGET_CONFIG } from "../config";

export const AZIMUTH_TICKS = Array.from({ length: AZIMUTH_WIDGET_CONFIG.dial.tick.count }, (_, index) => ({
	angle: index * AZIMUTH_WIDGET_CONFIG.dial.tick.angleStep,
	major: index % AZIMUTH_WIDGET_CONFIG.dial.tick.majorEvery === 0
}));

export const CARDINAL_POINTS = [
	{
		angle: 0,
		key: "north"
	},
	{
		angle: 90,
		key: "east"
	},
	{
		angle: 180,
		key: "south"
	},
	{
		angle: 270,
		key: "west"
	}
] as const;
