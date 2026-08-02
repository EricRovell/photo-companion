interface Point {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

/**
 * Generates the polygon's vertices coordinates.
 */
export function createTickCoords(count = 24, r1: number, r2: number): Point[] {
	const points: Point[] = [];

	for (let i = 0; i < count; i++) {
		const angle = 2 * Math.PI * i / count;

		points.push({
			x1: +(r1 * Math.cos(angle)).toFixed(2),
			x2: +(r2 * Math.cos(angle)).toFixed(2),
			y1: +(r1 * Math.sin(angle)).toFixed(2),
			y2: +(r2 * Math.sin(angle)).toFixed(2)
		});
	}

	return points;
}
