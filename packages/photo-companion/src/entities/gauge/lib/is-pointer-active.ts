/**
 * Checks does the pointer lies in between two angles.
 */
export function checkIsPointerActive(angle: number, angleStart: number, angleEnd: number) {
	if (angleEnd >= angleStart) {
		return angle >= angleStart && angle <= angleEnd;
	}

	return (angle >= angleStart && angle <= 360) || (angle >= 0 && angle <= angleEnd);
}
