export function getNormalizedPhase(phase: number) {
	return phase <= 0.5
		? phase
		: 1 - phase;
}

export function getNormalizedAngleRad(phase: number) {
	const norm = getNormalizedPhase(phase);
	const radians = (Math.PI * norm) / 0.5;
	return radians;
}

/**
 * Returns the clockwise SVG rotation of the Moon's phase shape.
 *
 * Astronomical bright-limb angles use the celestial-north axis, while the
 * phase shape already points right when waxing and left when waning.
 * The zenith angle must be in degrees.
 */
export function getMoonRotation(zenithAngle: number, waxing: boolean) {
	const phaseAxisOffset = waxing ? -90 : 90;
	return normalizeAngleDegrees(-zenithAngle + phaseAxisOffset);
}

export function normalizeAngleDegrees(angle: number) {
	return ((angle + 180) % 360 + 360) % 360 - 180;
}
