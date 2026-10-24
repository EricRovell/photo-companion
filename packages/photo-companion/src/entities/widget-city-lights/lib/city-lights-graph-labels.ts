export function getCityLightsLabelEdge(position: number) {
	return position < 10 ? "start" : position > 90 ? "end" : undefined;
}
