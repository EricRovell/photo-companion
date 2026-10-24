import { getLightsNight } from "lights-schedule";
import { createMemo } from "solid-js";

import { getLightsScheduleStatusMessage } from "~/entities/city-lights";
import { useTranslation } from "~/features/translation";

import { formatCityLightsDuration, formatCityLightsEvent, getCityLightsDayOffset, getCityLightsNightGraph } from "../lib";

import type { CityLightsWidgetProps } from "../types";

export function createCityLightsWidgetModel(props: CityLightsWidgetProps) {
	const { format, lang, t } = useTranslation();
	const relativeDay = createMemo(() => new Intl.RelativeTimeFormat(lang(), { numeric: "auto" }));
	const estimated = () => props.schedule.source === "SOLAR_ESTIMATE";
	const available = () => props.schedule.status !== "UNAVAILABLE";
	const scheduled = () => props.schedule.status === "SCHEDULED";
	const nightSchedule = createMemo(() => scheduled() ? getLightsNight(props.date, props.getScheduleForDate) : null);

	const night = createMemo(() => {
		const schedule = nightSchedule();
		return schedule ? getCityLightsNightGraph(schedule, props.date) : null;
	});
	const status = () => getLightsScheduleStatusMessage(props.schedule.status, t());

	const stateLabel = () => {
		if (!available()) {
			return t().RISE_SET.UNAVAILABLE;
		}
		if (estimated()) {
			return props.state.lights ? t().LIGHTS_WIDGET.EXPECTED_ON : t().LIGHTS_WIDGET.EXPECTED_OFF;
		}
		return props.state.lights ? t().LIGHTS_WIDGET.SCHEDULED_ON : t().LIGHTS_WIDGET.SCHEDULED_OFF;
	};

	const uncertainty = () => estimated() && scheduled() ? props.schedule.uncertaintyMinutes : 0;
	const withinWindow = () => nightSchedule()?.windows.some(event => props.date.getTime() >= event.windowStart && props.date.getTime() <= event.windowEnd) ?? false;

	const countdown = createMemo(() => scheduled() && props.state.timestamp !== null
		? { duration: Math.max(0, props.state.timestamp - props.date.getTime()) }
		: null);

	const dayLabel = (timestamp: number) => {
		const days = getCityLightsDayOffset(new Date(timestamp), props.date);
		return days === 0 ? t().RISE_SET.TODAY : relativeDay().format(days, "day");
	};

	const events = createMemo(() => ([ "LIGHTS_START", "LIGHTS_END" ] as const).map(name => formatCityLightsEvent(
		nightSchedule()?.events.find(event => event.name === name), name, {
			formatDay: dayLabel,
			formatTime: format().timeShort,
			label: name === "LIGHTS_START" ? t().LIGHTS_COMPARISON.SWITCH_ON : t().LIGHTS_COMPARISON.SWITCH_OFF,
			unavailable: t().RISE_SET.UNAVAILABLE
		}
	)));

	return {
		cityName: () => props.city === "OTHER" ? null : t().CITIES[props.city],
		countdown,
		countdownLabel: () => props.state.lights ? t().LABEL.TILL_TURNED_OFF : t().LABEL.TILL_TURNED_ON,
		duration: () => {
			const value = nightSchedule();
			return value ? formatCityLightsDuration(value.duration) : "—";
		},
		durationLabel: () => t().LABEL.DURATION_LIGHTS,
		estimated,
		events,
		lightsOn: () => available() && props.state.lights,
		night,
		selectedTime: () => `${t().LIGHTS_WIDGET.SELECTED_TIME}: ${format().datetime(props.date)}`,
		source: () => estimated() ? t().LIGHTS_SOURCE.SOLAR_ESTIMATE : t().LABEL.OFFICIAL_SCHEDULE,
		stateLabel,
		status,
		switchingWindowLabel: () => t().LIGHTS_WIDGET.WITHIN_WINDOW,
		title: () => t().TITLE.LIGHTS_DATA_BY_DATE,
		uncertaintyLabel: () => uncertainty() > 0
			? format().message(t().LIGHTS_WIDGET.SWITCHING_WINDOW, { duration: format().minutes(uncertainty()) })
			: null,
		withinWindow
	};
}
