import { createComputed, createMemo, createSignal, on } from "solid-js";
import { isServer } from "solid-js/web";
import { clamp } from "utils/math";

import type { Accessor } from "solid-js";

import { createTweened, linear } from "~/shared/primitives/tweened";

import { ALTITUDE_WIDGET_CONFIG } from "../config";
import { interpolateAltitudePoints } from "../lib/interpolate-altitude-points";

import type { AltitudeChartFrame } from "../types";

function interpolateChart(from: AltitudeChartFrame, to: AltitudeChartFrame, progress: number): AltitudeChartFrame {
	return {
		current: new Map(Array.from(to.current, ([ id, altitude ]) => [
			id,
			linear(from.current.get(id) ?? altitude, altitude, progress)
		])),
		cursorX: linear(from.cursorX, to.cursorX, progress),
		day: to.day,
		range: {
			max: linear(from.range.max, to.range.max, progress),
			min: linear(from.range.min, to.range.min, progress)
		},
		series: new Map(Array.from(to.series, ([ id, points ]) => [
			id,
			interpolateAltitudePoints(from.series.get(id) ?? points, points, progress)
		]))
	};
}

export function createTweenedAltitudeChart(target: Accessor<AltitudeChartFrame>) {
	if (isServer) {
		return target;
	}

	const initial = target();
	let revision = 0;

	const [ transition, setTransition ] = createSignal({
		end: 0,
		from: initial,
		start: 0,
		to: initial
	});

	const destination = createMemo(() => transition().end);
	const position = createTweened(destination, { duration: ALTITUDE_WIDGET_CONFIG.animation.transitionDuration });

	const chart = createMemo(() => {
		const { end, from, start, to } = transition();

		if (start === end) {
			return to;
		}

		const progress = clamp((position() - start) / (end - start), 0, 1);

		if (progress === 0) {
			return from;
		}

		return progress === 1 ? to : interpolateChart(from, to, progress);
	});

	createComputed(on(target, (next, previous) => {
		if (next.day.start === (previous?.day.start ?? initial.day.start)) {
			setTransition({
				end: revision,
				from: next,
				start: revision,
				to: next
			});
			return;
		}

		// A new revision retargets from the displayed frame, even after rapid date changes.
		setTransition({
			end: ++revision,
			from: chart(),
			start: position(),
			to: next
		});
	}, { defer: true }));

	return chart;
}
