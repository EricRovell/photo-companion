import { isSameDay, shiftDate } from "utils/date";
import { hoursMinutesFormatter } from "utils/formatters";
import { isNullable } from "utils/validators";

import type { RiseSetEventData, RiseSetWidgetProps } from "../types";
import type { Translation } from "~/features/translation";

interface EventFormatOptions {
	date: Date;
	formatDate: (date: Date) => string;
	formatTime: (date: Nullish<Date>) => string;
	labels: Pick<Translation["RISE_SET"], "NEXT_DAY" | "PREVIOUS_DAY" | "TODAY" | "UNAVAILABLE">;
}

type StatusOptions = Pick<RiseSetWidgetProps, "aboveHorizon" | "rise" | "set">;

function formatRiseSetDayLabel(date: Nullish<Date>, options: EventFormatOptions): string {
	if (isNullable(date)) {
		return options.labels.UNAVAILABLE;
	}

	if (isSameDay(date, options.date)) {
		return options.labels.TODAY;
	}

	if (isSameDay(date, shiftDate(options.date, "day", -1))) {
		return options.labels.PREVIOUS_DAY;
	}

	if (isSameDay(date, shiftDate(options.date, "day", 1))) {
		return options.labels.NEXT_DAY;
	}

	return options.formatDate(date);
}

export function formatRiseSetEvent(date: Nullish<Date>, label: string, options: EventFormatOptions): RiseSetEventData {
	return {
		date,
		day: formatRiseSetDayLabel(date, options),
		label,
		time: options.formatTime(date) || "—"
	};
}

export function getRiseSetStatusKey(options: StatusOptions) {
	if (isNullable(options.rise) && isNullable(options.set)) {
		return options.aboveHorizon ? "ABOVE_WITHOUT_EVENTS" : "BELOW_WITHOUT_EVENTS";
	}

	if (isNullable(options.rise)) {
		return "RISE_UNAVAILABLE";
	}

	return options.set ? null : "SET_UNAVAILABLE";
}

export function buildRiseSetAriaLabel(title: string, rise: RiseSetEventData, set: RiseSetEventData): string {
	const describe = (event: RiseSetEventData) => {
		return `${event.label}: ${[ event.time, event.day ].filter(Boolean).join(" ")}`;
	};

	return `${title}. ${describe(rise)}. ${describe(set)}`;
}

export function formatRiseSetDuration(rise: Nullish<Date>, set: Nullish<Date>, locale = "en"): string {
	if (!rise || !set) {
		return "";
	}

	const duration = set.getTime() - rise.getTime();

	if (!Number.isFinite(duration) || duration <= 0) {
		return "";
	}

	const totalMinutes = Math.round(duration / 60_000);

	return hoursMinutesFormatter(locale, "narrow")(totalMinutes);
}

export function formatRiseSetCountdown(milliseconds: number): string {
	const seconds = Math.ceil(Math.max(0, milliseconds) / 1000);
	return [
		Math.floor(seconds / 3600),
		Math.floor(seconds / 60) % 60,
		seconds % 60
	].map(value => String(value).padStart(2, "0")).join(":");
}
