export function getNearestStep(offset: number, tickWidth: number): number {
	const rawStep = -offset / tickWidth;
	return Math.sign(rawStep) * Math.floor(Math.abs(rawStep) + 0.5);
}
