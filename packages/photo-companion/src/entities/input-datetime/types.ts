import type { JSX } from "solid-js";
import type { DateShiftUnit } from "utils/date";

export type DateTimeStep = DateShiftUnit;

export interface InputDatetimeLabels {
	DATETIME: string;
	DATETIME_STEP: string;
	DATETIME_TIMELINE: string;
	DAY: string;
	HOUR: string;
	MINUTE: string;
	MONTH: string;
	NOW: string;
	OPEN_DATETIME_PICKER: string;
	YEAR: string;
}

export interface InputDatetimeProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	labels?: InputDatetimeLabels;
	locale?: string;
	onDatetimeChange?: (value: string) => void;
	onReset?: () => void;
}

export interface TimelineState {
	anchorDate: Date;
	animating: boolean;
	dragging: boolean;
	offset: number;
	step: DateTimeStep;
}

export interface TimelineTick {
	date: Date | null;
	offset: number;
}
