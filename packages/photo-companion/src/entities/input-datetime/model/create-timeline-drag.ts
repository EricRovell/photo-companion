import { type Accessor, onCleanup } from "solid-js";
import { isNullable } from "utils/validators";

import type { JSX } from "solid-js";
import type { SetStoreFunction, Store } from "solid-js/store";

import { getNearestStep } from "../lib/get-nearest-step";
import { shiftTimelineDate } from "../lib/shift-timeline-date";
import { DATETIME_CONFIG } from "./config";

import type { TimelineState } from "../types";

interface CreateTimelineDragOptions {
	animateToStep: (targetStep: number, initialVelocity?: number) => void;
	cancelAnimation: () => void;
	disabled: Accessor<boolean>;
	moveBy: (amount: number) => void;
	selectedStep: Accessor<number>;
	setState: SetStoreFunction<TimelineState>;
	state: Store<TimelineState>;
}

export function createTimelineDrag(options: CreateTimelineDragOptions) {
	let activePointer: null | number = null;
	let dragged = false;
	let lastPointerTime = 0;
	let lastPointerX = 0;
	let moveFrame = 0;
	let pendingDelta = 0;
	let pointerOriginX = 0;
	let resumeAfterTap = false;
	let suppressClick = false;
	let velocity = 0;

	const cancelPendingMove = () => {
		cancelAnimationFrame(moveFrame);
		moveFrame = 0;
		pendingDelta = 0;
	};

	const cancel = () => {
		cancelPendingMove();
		activePointer = null;
		options.setState("dragging", false);
	};

	const applyDragOffset = (initialOffset: number) => {
		const { width } = DATETIME_CONFIG.ticks;
		const stepCount = Math.trunc(-initialOffset / width);
		let nextOffset = initialOffset;

		if (stepCount !== 0) {
			const nextDate = shiftTimelineDate(options.state.anchorDate, options.state.step, stepCount);

			if (isNullable(nextDate)) {
				velocity = 0;
				options.setState("offset", 0);
				return;
			}

			options.setState("anchorDate", nextDate);
			nextOffset += stepCount * width;
		}

		options.setState("offset", nextOffset);
	};

	const releaseTimeline = (withVelocity: boolean) => {
		const { fling, ticks } = DATETIME_CONFIG;
		const projectedOffset = options.state.offset + (withVelocity ? velocity * fling.projectionMs : 0);
		const targetStep = Math.max(
			-fling.maxSteps,
			Math.min(fling.maxSteps, getNearestStep(projectedOffset, ticks.width))
		);
		options.animateToStep(targetStep, velocity);
		options.setState("dragging", false);
	};

	const handlePointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = (event) => {
		if (options.disabled() || event.button !== 0) {
			return;
		}

		resumeAfterTap = options.state.animating || Math.abs(options.state.offset) >= 0.5;
		options.cancelAnimation();
		cancelPendingMove();
		activePointer = event.pointerId;
		dragged = false;
		lastPointerTime = event.timeStamp;
		lastPointerX = event.clientX;
		pointerOriginX = event.clientX;
		velocity = 0;
		options.setState("dragging", true);
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = (event) => {
		if (activePointer !== event.pointerId) {
			return;
		}

		const elapsed = Math.max(event.timeStamp - lastPointerTime, 1);
		const delta = event.clientX - lastPointerX;
		const instantaneousVelocity = delta / elapsed;
		pendingDelta += delta;
		velocity = elapsed > 50 || Math.sign(instantaneousVelocity) !== Math.sign(velocity)
			? instantaneousVelocity
			: velocity * 0.55 + instantaneousVelocity * 0.45;
		lastPointerTime = event.timeStamp;
		lastPointerX = event.clientX;
		dragged ||= Math.abs(event.clientX - pointerOriginX) > 4;

		if (moveFrame === 0) {
			moveFrame = requestAnimationFrame(() => {
				applyDragOffset(options.state.offset + pendingDelta);
				pendingDelta = 0;
				moveFrame = 0;
			});
		}
	};

	const finishPointer = (event: PointerEvent, withVelocity: boolean) => {
		if (activePointer !== event.pointerId) {
			return;
		}

		if (moveFrame !== 0) {
			cancelAnimationFrame(moveFrame);
			moveFrame = 0;
			applyDragOffset(options.state.offset + pendingDelta);
			pendingDelta = 0;
		}

		const didDrag = dragged;
		const idleTime = Math.max(event.timeStamp - lastPointerTime, 0);

		if (withVelocity && idleTime > 40) {
			velocity *= Math.max(0, 1 - (idleTime - 40) / 120);
		}

		activePointer = null;
		suppressClick = didDrag;
		setTimeout(() => {
			suppressClick = false;
		}, 0);

		if (didDrag) {
			releaseTimeline(withVelocity);
		} else if (resumeAfterTap) {
			releaseTimeline(false);
		} else {
			options.setState("dragging", false);
		}
	};

	const handlePointerUp: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = (event) => {
		finishPointer(event, true);
	};

	const handlePointerCancel: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = (event) => {
		finishPointer(event, false);
	};

	const handleTickClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (event) => {
		if (suppressClick || options.disabled()) {
			return;
		}

		const target = event.target as HTMLElement;
		const tick = target.closest<HTMLElement>("[data-tick-offset]");
		const bounds = event.currentTarget.getBoundingClientRect();
		const clickedStep = isNullable(tick)
			? Math.round((event.clientX - bounds.left - bounds.width / 2 - options.state.offset) / DATETIME_CONFIG.ticks.width)
			: Number(tick.dataset.tickOffset);
		options.moveBy(clickedStep - options.selectedStep());
	};

	onCleanup(cancel);

	return {
		cancel,
		handlePointerCancel,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handleTickClick
	};
}
