import { type Accessor, createEffect, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { isNullable } from "utils/validators";

import type { JSX } from "solid-js";

import { createQueryDate } from "~/shared/lib/query-date";

import { createSelectedDateFormatter } from "../lib/create-selected-date-formatter";
import { createTickLabelFormatter } from "../lib/create-tick-label-formatter";
import { getNearestStep } from "../lib/get-nearest-step";
import { parseDatetimeValue } from "../lib/parse-datetime-value";
import { shiftTimelineDate } from "../lib/shift-timeline-date";
import { DATETIME_CONFIG } from "./config";
import { createNativeDatetimePicker } from "./create-native-datetime-picker";
import { createTimelineAnimation } from "./create-timeline-animation";
import { createTimelineDrag } from "./create-timeline-drag";

import type {
	DateTimeStep,
	InputDatetimeProps,
	TimelineState,
	TimelineTick
} from "../types";

interface CreateInputDatetimeModelOptions {
	disabled: Accessor<boolean>;
	locale: Accessor<string>;
	onDatetimeChange: Accessor<InputDatetimeProps["onDatetimeChange"]>;
	onReset: Accessor<InputDatetimeProps["onReset"]>;
	value: Accessor<InputDatetimeProps["value"]>;
}

export function createInputDatetimeModel(options: CreateInputDatetimeModelOptions) {
	const initialDate = parseDatetimeValue(options.value()) ?? new Date();

	const [ state, setState ] = createStore<TimelineState>({
		anchorDate: initialDate,
		animating: false,
		dragging: false,
		offset: 0,
		step: "day"
	});

	const formatter = createMemo(() => createSelectedDateFormatter(options.locale()));
	const tickLabelFormatter = createMemo(() => createTickLabelFormatter(options.locale()));

	let pendingValue: null | string = null;

	const ticks = createMemo<TimelineTick[]>(() => {
		const anchorDate = state.anchorDate;
		const middle = Math.floor(DATETIME_CONFIG.ticks.count / 2);
		const step = state.step;
		return Array.from({ length: DATETIME_CONFIG.ticks.count }, (_, index) => {
			const tickOffset = index - middle;
			return {
				date: shiftTimelineDate(anchorDate, step, tickOffset),
				offset: tickOffset
			};
		});
	});

	const selectedStep = createMemo(() => (
		getNearestStep(state.offset, DATETIME_CONFIG.ticks.width)
	));

	const selectedDate = createMemo(() => (
		shiftTimelineDate(state.anchorDate, state.step, selectedStep()) ?? state.anchorDate
	));

	const selectedValue = createMemo(() => formatter().format(selectedDate()));

	const formatTickLabel = (date: Date | null) => (
		isNullable(date) ? "" : tickLabelFormatter()(date, state.step)
	);

	const commitDate = (date: Date) => {
		const value = createQueryDate(date);
		pendingValue = value;
		options.onDatetimeChange()?.(value);
	};

	const setDate = (date: Date) => {
		setState("anchorDate", date);
		setState("offset", 0);
	};

	const animation = createTimelineAnimation({ commitDate, setState, state });

	const moveBy = (amount: number) => {
		const currentDate = selectedDate();
		const nextDate = shiftTimelineDate(currentDate, state.step, amount);

		if (isNullable(nextDate) || amount === 0) {
			return;
		}

		animation.cancel();
		setDate(currentDate);
		animation.animateToStep(amount);
	};

	const drag = createTimelineDrag({
		animateToStep: animation.animateToStep,
		cancelAnimation: animation.cancel,
		disabled: options.disabled,
		moveBy,
		selectedStep,
		setState,
		state
	});

	const cancelInteraction = () => {
		animation.cancel();
		drag.cancel();
	};

	const picker = createNativeDatetimePicker({
		cancelInteraction,
		disabled: options.disabled,
		onDatetimeChange: options.onDatetimeChange,
		setDate,
		setPendingValue: value => pendingValue = value
	});

	const handleKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = (event) => {
		if (options.disabled() || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
			return;
		}

		event.preventDefault();
		moveBy(event.key === "ArrowRight" ? 1 : -1);
	};

	const handleStepChange: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (event) => {
		const currentDate = selectedDate();
		cancelInteraction();
		setDate(currentDate);
		setState("step", event.currentTarget.value as DateTimeStep);
	};

	const handleReset = () => {
		const date = new Date();
		const onReset = options.onReset();
		cancelInteraction();
		setDate(date);

		if (onReset) {
			pendingValue = null;
			onReset();
			return;
		}

		commitDate(date);
	};

	createEffect(() => {
		const value = options.value();

		if (typeof value !== "string" || state.dragging || state.animating) {
			return;
		}

		if (!isNullable(pendingValue)) {
			if (pendingValue === value) {
				pendingValue = null;
			}
			return;
		}

		const date = parseDatetimeValue(value);

		if (!isNullable(date)) {
			setDate(date);
		}
	});

	return {
		dragging: () => state.dragging,
		formatTickLabel,
		handleKeyDown,
		handleOpenPicker: picker.open,
		handlePickerChange: picker.handleChange,
		handlePointerCancel: drag.handlePointerCancel,
		handlePointerDown: drag.handlePointerDown,
		handlePointerMove: drag.handlePointerMove,
		handlePointerUp: drag.handlePointerUp,
		handleReset,
		handleStepChange,
		handleTickClick: drag.handleTickClick,
		offset: () => state.offset,
		selectedDate,
		selectedStep,
		selectedValue,
		setInputRef: picker.setInputRef,
		step: () => state.step,
		ticks
	};
}

export type InputDatetimeModel = ReturnType<typeof createInputDatetimeModel>;
