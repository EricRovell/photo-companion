import { createMemo } from "solid-js";
import { getDayStart } from "utils/date";
import { hoursMinutesFormatter } from "utils/formatters";
import { isNullable } from "utils/validators";

import { useTranslation } from "~/features/translation";

import { createSunlightDay, getFollowingSunlightChange } from "../lib";

import type { SunlightMarker, SunlightPhase, SunlightTick, SunlightTransition, SunlightWidgetProps } from "../types";

export function createSunlightModel(props: SunlightWidgetProps) {
	const { format, lang, t } = useTranslation();

	const formatDuration = createMemo(() => hoursMinutesFormatter(lang()));

	const phaseLabel = (phase: SunlightPhase) => ({
		astronomical: t().SUNLIGHT.ASTRONOMICAL_TWILIGHT,
		blue: t().SUNLIGHT.BLUE_HOUR,
		civil: t().SUNLIGHT.CIVIL_TWILIGHT,
		daylight: t().SUNLIGHT.DAYLIGHT,
		golden: t().SUNLIGHT.GOLDEN_HOUR,
		nautical: t().SUNLIGHT.NAUTICAL_TWILIGHT,
		night: t().SUNLIGHT.NIGHT
	})[phase];

	const start = createMemo(() => getDayStart(props.date));

	const observer = createMemo(() => ({
		latitude: props.latitude,
		longitude: props.longitude
	}));

	const day = createMemo(() => createSunlightDay(new Date(start()), observer()));
	const progress = (timestamp: number) => (timestamp - day().start) / (day().end - day().start);
	const current = createMemo(() => day().intervals.find(interval => props.date.getTime() >= interval.start && props.date.getTime() < interval.end) ?? day().intervals[0]);
	const allDay = () => day().intervals.length === 1;
	const followingChange = createMemo(() => allDay() ? null : getFollowingSunlightChange(day(), observer()));

	const nextChange = createMemo<null | SunlightTransition>(() => {
		const next = day().intervals.find(interval => interval.start === current().end);
		return next ? {
			phase: next.phase,
			timestamp: next.start
		} : followingChange();
	});

	const nextPhase = createMemo(() => {
		const next = nextChange();

		if (isNullable(next)) {
			return t().SUNLIGHT.NO_CHANGE_TODAY;
		}

		const minutes = Math.max(
			0,
			Math.ceil((next.timestamp - props.date.getTime()) / 60_000)
		);

		return format().message(t().SUNLIGHT.NEXT_PHASE_IN, {
			duration: formatDuration()(minutes),
			phase: phaseLabel(next.phase)
		});
	});

	const formatTime = (timestamp: number) => timestamp === day().end ? "24:00" : format().timeShort(timestamp);
	const markerLabel = (type: SunlightMarker["type"], timestamp: number) => `${type === "sunrise" ? t().RISE_SET.SUNRISE : t().RISE_SET.SUNSET}: ${formatTime(timestamp)}`;

	const ticks = createMemo(() => {
		const { end, start } = day();
		const ticks: SunlightTick[] = [];

		// Elapsed-hour steps retain skipped/repeated hours on DST dates.
		for (let timestamp = start; timestamp < end; timestamp += 60 * 60 * 1000) {
			ticks.push({
				major: new Date(timestamp).getHours() % 6 === 0,
				progress: progress(timestamp),
				timestamp
			});
		}

		return ticks;
	});

	return {
		current,
		day,
		formatTime,
		markerLabel,
		nextPhase,
		phaseLabel,
		progress,
		ticks
	};
}
