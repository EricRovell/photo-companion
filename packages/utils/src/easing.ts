export type EasingFn = (t: number) => number;

export const linear: EasingFn = t => t;

export const cubicInOut: EasingFn = t => {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
