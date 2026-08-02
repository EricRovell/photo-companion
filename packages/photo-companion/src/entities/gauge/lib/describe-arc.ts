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
