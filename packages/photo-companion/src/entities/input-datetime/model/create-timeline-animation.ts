import { onCleanup } from "solid-js";
import { isNullable } from "utils/validators";

import type { Store, StoreSetter } from "solid-js";

import { createMediaQuery } from "~/shared/primitives";

import { getNearestStep } from "../lib/get-nearest-step";
import { shiftTimelineDate } from "../lib/shift-timeline-date";
import { DATETIME_CONFIG } from "./config";

import type { TimelineState } from "../types";

interface CreateTimelineAnimationOptions {
	commitDate: (date: Date) => void;
	setState: StoreSetter<TimelineState>;
	state: Store<TimelineState>;
}

export function createTimelineAnimation(options: CreateTimelineAnimationOptions) {
	const prefersReducedMotion = createMediaQuery("(prefers-reduced-motion: reduce)");
	let animationFrame = 0;

	const cancel = () => {
		cancelAnimationFrame(animationFrame);
		animationFrame = 0;
		options.setState((draft) => {
			draft.animating = false;
		});
	};

	const animateToStep = (targetStep: number, initialVelocity = 0) => {
		const { spring, ticks } = DATETIME_CONFIG;
		const startOffset = options.state.offset;
		let springAnchor = options.state.anchorDate;
		let resolvedStep = targetStep;
		let targetDate = shiftTimelineDate(springAnchor, options.state.step, resolvedStep);

		while (isNullable(targetDate) && resolvedStep !== 0) {
			resolvedStep -= Math.sign(resolvedStep);
			targetDate = shiftTimelineDate(springAnchor, options.state.step, resolvedStep);
		}

		if (isNullable(targetDate)) {
			options.setState((draft) => {
				draft.offset = 0;
				draft.animating = false;
			});

			return;
		}

		let endOffset = -resolvedStep * ticks.width;

		if (prefersReducedMotion() || Math.abs(endOffset - startOffset) < 0.5) {
			options.setState((draft) => {
				draft.anchorDate = targetDate;
				draft.offset = 0;
			});
			options.commitDate(targetDate);
			options.setState((draft) => {
				draft.animating = false;
			});

			return;
		}

		const start = performance.now();
		let position = startOffset;
		let previousTime = start;
		let springVelocity = initialVelocity * 1000;

		options.setState((draft) => {
			draft.animating = true;
		});

		const tick = (time: number) => {
			const elapsed = Math.min((time - previousTime) / 1000, 0.032);
			const displacement = position - endOffset;
			const acceleration = -spring.stiffness * displacement - spring.damping * springVelocity;
			previousTime = time;
			springVelocity += acceleration * elapsed;
			position += springVelocity * elapsed;

			const rebaseStep = getNearestStep(position, ticks.width);

			if (rebaseStep !== 0) {
				const rebasedDate = shiftTimelineDate(springAnchor, options.state.step, rebaseStep);

				if (!isNullable(rebasedDate)) {
					springAnchor = rebasedDate;
					position += rebaseStep * ticks.width;
					endOffset += rebaseStep * ticks.width;

					options.setState((draft) => {
						draft.anchorDate = rebasedDate;
					});
				}
			}

			options.setState((draft) => {
				draft.offset = position;
			});

			const settled = (
				Math.abs(position - endOffset) <= spring.settleDistance &&
				Math.abs(springVelocity) <= spring.settleVelocity
			);

			if (!prefersReducedMotion() && !settled && time - start < spring.maxDuration) {
				animationFrame = requestAnimationFrame(tick);

				return;
			}

			animationFrame = 0;

			if (springAnchor.getTime() !== targetDate.getTime()) {
				options.setState((draft) => {
					draft.anchorDate = targetDate;
				});
			}

			options.setState((draft) => {
				draft.offset = 0;
			});

			options.commitDate(targetDate);

			options.setState((draft) => {
				draft.animating = false;
			});
		};

		animationFrame = requestAnimationFrame(tick);
	};

	onCleanup(() => cancelAnimationFrame(animationFrame));

	return {
		animateToStep,
		cancel
	};
}
