import { createMemo, Show } from "solid-js";

import type { ScheduledLightsSchedule } from "types";

import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

import {
	getLightsScheduleComparison,
	getLightsScheduleStatusMessage,
	getPreviousDate
} from "../lib";
import { useCityLights } from "../model";
import { LightsCountdown } from "./lights-countdown";

import styles from "./lights-info.module.css";

export const LightsInfo = () => {
	const { getCity, getScheduleByDate, getScheduleForDate, getStateByDate } = useCityLights();
	const { getDatetime } = useDatetime();
	const { format, t } = useTranslation();
	const getSchedule = getScheduleByDate;

	const getComparison = createMemo(() => getLightsScheduleComparison(
		getSchedule(),
		getScheduleForDate(getPreviousDate(getDatetime()))
	));

	const lightsOn = () => getStateByDate().lights;
	const getScheduledSchedule = (): null | ScheduledLightsSchedule => {
		const schedule = getSchedule();
		return schedule.status === "SCHEDULED" ? schedule : null;
	};
	const getStatusMessage = () => getLightsScheduleStatusMessage(getSchedule().status, t());

	const getSource = () => {
		const schedule = getSchedule();

		if (schedule.source === "SCHEDULE") {
			return t().LABEL.OFFICIAL_SCHEDULE;
		}

		return schedule.uncertaintyMinutes > 0
			? `${t().LABEL.SOLAR_ESTIMATE} (±${format().minutes(schedule.uncertaintyMinutes)})`
			: t().LABEL.SOLAR_ESTIMATE;
	};

	const formatClockDifference = (minutes: number) => {
		const direction = minutes < 0
			? t().LIGHTS_COMPARISON.EARLIER
			: t().LIGHTS_COMPARISON.LATER;
		return {
			text: `${format().minutes(Math.abs(minutes))} ${direction} ${t().LIGHTS_COMPARISON.THAN_YESTERDAY}`,
			tone: minutes < 0 ? "danger" : "success"
		};
	};

	const formatDurationDifference = (minutes: number) => {
		const direction = minutes < 0
			? t().LIGHTS_COMPARISON.SHORTER
			: t().LIGHTS_COMPARISON.LONGER;
		return {
			text: `${format().minutes(Math.abs(minutes))} ${direction} ${t().LIGHTS_COMPARISON.THAN_YESTERDAY}`,
			tone: minutes < 0 ? "danger" : "success"
		};
	};

	const getStartDifference = () => {
		const minutes = getComparison()?.startMinutes;
		return minutes ? formatClockDifference(minutes) : null;
	};

	const getEndDifference = () => {
		const minutes = getComparison()?.endMinutes;
		return minutes ? formatClockDifference(minutes) : null;
	};

	const getDurationDifference = () => {
		const minutes = getComparison()?.durationMinutes;
		return minutes ? formatDurationDifference(minutes) : null;
	};

	return (
		<PropertyList class={styles.root}>
			<PropertyList.Header>{t().TITLE.LIGHTS_FULL}</PropertyList.Header>
			<PropertyList.Body class={styles.body}>
				<PropertyList.Item class={styles.cell}>
					<PropertyList.Label>
						{t().LABEL.CITY}
					</PropertyList.Label>
					<PropertyList.Value class={styles["metric-value"]}>
						<span>{t().CITIES[getCity()]}</span>
						<small class={styles.status}>{getSource()}</small>
					</PropertyList.Value>
				</PropertyList.Item>
				<PropertyList.Item class={styles.cell}>
					<PropertyList.Label>
						{t().LABEL.LIGHTS_CITY}
					</PropertyList.Label>
					<PropertyList.Value class={styles["metric-value"]}>
						<span data-text={lightsOn() ? "success" : "danger"}>
							{lightsOn() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
						</span>
						<Show when={getStatusMessage()}>
							{message => <small class={styles.status}>{message()}</small>}
						</Show>
					</PropertyList.Value>
				</PropertyList.Item>
				<Show when={getScheduledSchedule()}>
					{schedule => (
						<>
							<LightsCountdown
								class={styles.cell}
								lights={lightsOn()}
								valueClass={styles.value}
							/>
							<PropertyList.Item class={styles.cell}>
								<PropertyList.Label>{t().LIGHTS_COMPARISON.SWITCH_ON}</PropertyList.Label>
								<PropertyList.Value class={styles["metric-value"]}>
									<strong>{format().timeShort(schedule().LIGHTS_START)}</strong>
									<Show when={getStartDifference()}>
										{difference => (
											<small class={styles.delta} data-text={difference().tone}>
												{difference().text}
											</small>
										)}
									</Show>
								</PropertyList.Value>
							</PropertyList.Item>
							<PropertyList.Item class={styles.cell}>
								<PropertyList.Label>{t().LIGHTS_COMPARISON.SWITCH_OFF}</PropertyList.Label>
								<PropertyList.Value class={styles["metric-value"]}>
									<strong>{format().timeShort(schedule().LIGHTS_END)}</strong>
									<Show when={getEndDifference()}>
										{difference => (
											<small class={styles.delta} data-text={difference().tone}>
												{difference().text}
											</small>
										)}
									</Show>
								</PropertyList.Value>
							</PropertyList.Item>
							<PropertyList.Item class={styles.cell}>
								<PropertyList.Label>{t().LABEL.DURATION_LIGHTS}</PropertyList.Label>
								<PropertyList.Value class={styles["metric-value"]}>
									<strong>{format().timeDuration(schedule().duration)}</strong>
									<Show when={getDurationDifference()}>
										{difference => (
											<small class={styles.delta} data-text={difference().tone}>
												{difference().text}
											</small>
										)}
									</Show>
								</PropertyList.Value>
							</PropertyList.Item>
						</>
					)}
				</Show>
			</PropertyList.Body>
		</PropertyList>
	);
};
