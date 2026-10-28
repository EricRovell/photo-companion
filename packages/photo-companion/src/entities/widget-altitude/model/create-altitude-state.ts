import { createMemo } from "solid-js";
import { clamp } from "utils/math";

import { ALTITUDE_WIDGET_CONFIG } from "../config";
import { altitudeX, altitudeY } from "../lib/altitude-coordinates";
import { createAltitudePath } from "../lib/create-altitude-path";
import { getAltitudeRange } from "../lib/get-altitude-range";
import { getAltitudeTicks } from "../lib/get-altitude-ticks";
import { getDayBounds } from "../lib/get-day-bounds";
import { sampleAltitude } from "../lib/sample-altitude";
import { createTweenedAltitudeChart } from "./create-tweened-altitude-chart";

import type { AltitudeChartFrame, AltitudeEntity, AltitudeWidgetProps } from "../types";

export function createAltitudeState(
	props: AltitudeWidgetProps,
	isSelected: (id: AltitudeEntity["id"]) => boolean = () => true
) {
	const day = createMemo(() => getDayBounds(props.date), undefined, {
		equals: (previous, next) => previous.start === next.start && previous.end === next.end
	});

	const observer = createMemo(() => ({
		latitude: props.latitude,
		longitude: props.longitude
	}));

	const series = createMemo(() => {
		const { end, start } = day();

		return props.entities.map(entity => {
			const { peak, points } = sampleAltitude(start, end, instant => entity.getPosition({
				instant,
				observer: observer()
			}).apparentAltitude);

			return {
				...entity,
				peak,
				points
			};
		});
	});

	const targetRange = createMemo(() => getAltitudeRange(series()
		.filter(entity => isSelected(entity.id))
		.flatMap(entity => [ ...entity.points, entity.peak ])));

	const current = createMemo(() => new Map(props.entities.map(entity => [
		entity.id,
		entity.getPosition({
			instant: props.date,
			observer: observer()
		}).apparentAltitude
	])));

	const x = (timestamp: number) => altitudeX(timestamp, day().start, day().end);

	const target = createMemo<AltitudeChartFrame>(() => ({
		current: current(),
		cursorX: x(props.date.getTime()),
		day: day(),
		range: targetRange(),
		series: new Map(series().map(entity => [ entity.id, entity.points ]))
	}));

	const chart = createTweenedAltitudeChart(target);
	const range = () => chart().range;
	const y = (altitude: number) => altitudeY(altitude, range());

	const horizon = createMemo(() => clamp(y(0), ALTITUDE_WIDGET_CONFIG.plot.top, ALTITUDE_WIDGET_CONFIG.plot.bottom));
	const isHorizonVisible = () => range().min <= 0 && range().max >= 0;
	const altitudeTicks = createMemo(() => getAltitudeTicks(range()));

	const paths = createMemo(() => {
		const frame = chart();
		const { end, start } = frame.day;

		return new Map(Array.from(frame.series, ([ id, points ]) => [
			id,
			createAltitudePath(points, start, end, frame.range)
		]));
	});

	const getPath = (id: AltitudeEntity["id"]) => paths().get(id) ?? "";

	const getAltitude = (id: AltitudeEntity["id"]) => current().get(id) ?? 0;
	const getMarkerAltitude = (id: AltitudeEntity["id"]) => chart().current.get(id) ?? 0;
	const cursorX = () => chart().cursorX;

	return {
		altitudeTicks,
		cursorX,
		day,
		getAltitude,
		getMarkerAltitude,
		getPath,
		horizon,
		isHorizonVisible,
		range,
		series,
		x,
		y
	};
}
