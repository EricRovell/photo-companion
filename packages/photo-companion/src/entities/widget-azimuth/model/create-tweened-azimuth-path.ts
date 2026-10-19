import { createEffect, createSignal, on, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import { cubicInOut } from "utils/easing";
import { normalizeDegrees } from "utils/math";

import type { Accessor } from "solid-js";

import { circular } from "~/shared/primitives";

import { AZIMUTH_WIDGET_CONFIG } from "../config";

import type { AzimuthPathPoint } from "../types";

const interpolateAzimuth = circular(360);

function interpolatePath(
	from: AzimuthPathPoint[],
	to: AzimuthPathPoint[],
	progress: number
) {
	return to.map((point, index) => ({
		altitude: from[index].altitude + (point.altitude - from[index].altitude) * progress,
		azimuth: normalizeDegrees(interpolateAzimuth(from[index].azimuth, point.azimuth, progress))
	}));
}

export function createTweenedAzimuthPath(target: Accessor<AzimuthPathPoint[]>) {
	if (isServer) {
		return target;
	}

	const [ path, setPath ] = createSignal(target());

	createEffect(on(target, (targetPath) => {
		const initialPath = path();

		if (initialPath.length !== targetPath.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setPath(targetPath);
			return;
		}

		const start = performance.now();
		let frameId: number;

		function tick(time: number) {
			const elapsed = time - start;
			const progress = Math.min(elapsed / AZIMUTH_WIDGET_CONFIG.animation.transitionDuration, 1);

			setPath(interpolatePath(initialPath, targetPath, cubicInOut(progress)));

			if (progress < 1) {
				frameId = requestAnimationFrame(tick);
			}
		}

		frameId = requestAnimationFrame(tick);

		onCleanup(() => cancelAnimationFrame(frameId));
	}, { defer: true }));

	return path;
}
