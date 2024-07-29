export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	};
}

export function describeArc(x: number, y: number, r1: number, r2: number, angleStart: number, angleEnd: number){
	if (angleStart === angleEnd) {
		return "";
	}

	const innerStart = polarToCartesian(x, y, r1, angleEnd);
	const innerEnd = polarToCartesian(x, y, r1, angleStart);
	const outerStart = polarToCartesian(x, y, r2, angleEnd);
	const outerEnd = polarToCartesian(x, y, r2, angleStart);

	let largeArcFlag = "0";

	if (angleEnd >= angleStart) {
		largeArcFlag = angleEnd - angleStart <= 180 ? "0" : "1";
	} else {
		largeArcFlag = (angleEnd + 360.0) - angleStart <= 180 ? "0" : "1";
	}

	return [
		"M", outerStart.x, outerStart.y,
		"A", r2, r2, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
		"L", innerEnd.x, innerEnd.y,
		"A", r1, r1, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
		"L", outerStart.x, outerStart.y,
		"Z"
	].join(" ");
}

interface Point {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

/**
 * Generates the polygon's vertices coordinates.
 */
export const createMarksCoords = (count = 24, r1: number, r2: number): Point[] => {
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
};

/**
 * Checks does the pointer lies in between two angles.
 */
export function checkIsPointerActive(angle: number, angleStart: number, angleEnd: number) {
	if (angleEnd >= angleStart) {
		return angle >= angleStart && angle <= angleEnd;
	}

	return (angle >= angleStart && angle <= 360) || (angle >= 0 && angle <= angleEnd);
}
