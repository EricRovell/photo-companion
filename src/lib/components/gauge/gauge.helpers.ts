export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

export function describeArc(x: number, y: number, radius: number, angleStart: number, angleEnd: number){
	const start = polarToCartesian(x, y, radius, angleEnd);
	const end = polarToCartesian(x, y, radius, angleStart);

	let largeArcFlag = "0";

	if (angleEnd >= angleStart) {
		largeArcFlag = angleEnd - angleStart <= 180 ? "0" : "1";
	} else {
		largeArcFlag = (angleEnd + 360.0) - angleStart <= 180 ? "0" : "1";
	}

	var d = [
		"M", start.x, start.y, 
		"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ");

	return d;
}

interface Point {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
};

/**
 * Generates the polygon's vertices coordinates.
 */
export const createMarksCoords = (count = 24, r1: number, r2: number): Point[] => {
	const points: Point[] = [];

	for (let i = 0; i < count; i++) {
		const angle = 2 * Math.PI * i / count;

		points.push({
			x1: +(r1 * Math.cos(angle)).toFixed(2),
			y1: +(r1 * Math.sin(angle)).toFixed(2),
			x2: +(r2 * Math.cos(angle)).toFixed(2),
			y2: +(r2 * Math.sin(angle)).toFixed(2)
		});
	}

	return points;
};
