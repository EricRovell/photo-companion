/**
 * Creates a "wavy" path following the given path with a specified amplitude
 * and stepLength values.
 */
export function createWavyPath(path: string, stepLength: number, amplitude: number) {
	const referencePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	referencePath.setAttribute("d", path);

	const pathLength = referencePath.getTotalLength();
	const stepCount = Math.round(pathLength / stepLength);

	let pos = referencePath.getPointAtLength(0);
	const resultPath = [ `M ${pos.x},${pos.y}` ];
	let orientation = -1;

	for (let i = 1; i <= stepCount; i++) {
		const last = pos;
		pos = referencePath.getPointAtLength(i * pathLength / stepCount);

		// Find a point halfway between last and pos. Then find the point that is
		// perpendicular to that line segment, and is squiggleAmplitude away from
		// it on the side of the line designated by 'orientation' (-1 or +1).
		// This point will be the control point of the quadratic curve forming the
		// squiggle stepLength.
		
		// The vector from the last point to this one
		const vector = {
			x: pos.x - last.x,
			y: pos.y - last.y
		};

		const vectorLength = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

		const mid = {
			x: last.x + vector.x / 2,
			y: last.y + vector.y / 2
		};

		const normalVector = {
			x: -amplitude * vector.y / vectorLength,
			y: amplitude * vector.x / vectorLength
		};

		const controlPoint = {
			x: mid.x + normalVector.x * orientation,
			y: mid.y + normalVector.y * orientation
		};

		resultPath.push(`Q ${controlPoint.x},${controlPoint.y},${pos.x},${pos.y}`);

		orientation *= -1;
	}

	return resultPath.join(" ");
}
