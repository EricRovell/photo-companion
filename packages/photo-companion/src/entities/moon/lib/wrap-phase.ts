export function wrapPhase(phase: number) {
	return ((phase % 1) + 1) % 1;
}
