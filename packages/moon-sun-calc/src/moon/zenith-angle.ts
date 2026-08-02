/**
 * Calculates the Moon's bright-limb angle relative to the observer's zenith.
 *
 * Both inputs must use the same angular unit. The result uses that unit too.
 */
export function getMoonZenithAngle(illuminationAngle: number, parallacticAngle: number): number {
	return illuminationAngle - parallacticAngle;
}
