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
