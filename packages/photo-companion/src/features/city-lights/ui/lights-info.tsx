import { createMemo, Show } from "solid-js";

import { useDatetime } from "~/features/datetime-query";
import { useTranslation } from "~/features/translation";
import { PropertyList } from "~/shared/ui";

import { getLightsScheduleComparison, getPreviousDate } from "../lib";
import { useCityLights } from "../model";
import { LightsCountdown } from "./lights-countdown";

import styles from "./lights-info.module.css";

export const LightsInfo = () => {
	const { getCity, getScheduleByDate, getScheduleForDate, getStateByDate } = useCityLights();
	const { getDatetime } = useDatetime();
	const { format, t } = useTranslation();
	const comparison = createMemo(() => getLightsScheduleComparison(
		getScheduleByDate(),
		getScheduleForDate(getPreviousDate(getDatetime()))
	));

	const lightsOn = () => getStateByDate().lights;
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
	const startDifference = () => formatClockDifference(comparison().startMinutes);
	const endDifference = () => formatClockDifference(comparison().endMinutes);
	const durationDifference = () => formatDurationDifference(comparison().durationMinutes);

	return (
		<PropertyList class={styles.root}>
			<PropertyList.Header>{t().TITLE.LIGHTS_FULL}</PropertyList.Header>
			<PropertyList.Body class={styles.body}>
				<PropertyList.Item class={styles.cell}>
					<PropertyList.Label>
						{t().LABEL.CITY}
					</PropertyList.Label>
					<PropertyList.Value class={styles.value}>
						{t().CITIES[getCity()]}
					</PropertyList.Value>
				</PropertyList.Item>
				<PropertyList.Item class={styles.cell}>
					<PropertyList.Label>
						{t().LABEL.LIGHTS_CITY}
					</PropertyList.Label>
					<PropertyList.Value class={styles.value}>
						<span data-text={lightsOn() ? "success" : "danger"}>
							{lightsOn() ? t().LABEL.TURNED_ON : t().LABEL.TURNED_OFF}
						</span>
					</PropertyList.Value>
				</PropertyList.Item>
				<LightsCountdown
					class={styles.cell}
					lights={lightsOn()}
					valueClass={styles.value}
				/>
				<PropertyList.Item class={styles.cell}>
					<PropertyList.Label>{t().LIGHTS_COMPARISON.SWITCH_ON}</PropertyList.Label>
					<PropertyList.Value class={styles["metric-value"]}>
						<strong>{format().timeShort(getScheduleByDate().LIGHTS_START)}</strong>
						<Show when={comparison().startMinutes !== 0}>
							<small class={styles.delta} data-text={startDifference().tone}>
								{startDifference().text}
							</small>
						</Show>
					</PropertyList.Value>
				</PropertyList.Item>
				<PropertyList.Item class={styles.cell}>
					<PropertyList.Label>{t().LIGHTS_COMPARISON.SWITCH_OFF}</PropertyList.Label>
					<PropertyList.Value class={styles["metric-value"]}>
						<strong>{format().timeShort(getScheduleByDate().LIGHTS_END)}</strong>
						<Show when={comparison().endMinutes !== 0}>
							<small class={styles.delta} data-text={endDifference().tone}>
								{endDifference().text}
							</small>
						</Show>
					</PropertyList.Value>
				</PropertyList.Item>
				<PropertyList.Item class={styles.cell}>
					<PropertyList.Label>{t().LABEL.DURATION_LIGHTS}</PropertyList.Label>
					<PropertyList.Value class={styles["metric-value"]}>
						<strong>{format().timeDuration(getScheduleByDate().duration)}</strong>
						<Show when={comparison().durationMinutes !== 0}>
							<small class={styles.delta} data-text={durationDifference().tone}>
								{durationDifference().text}
							</small>
						</Show>
					</PropertyList.Value>
				</PropertyList.Item>
			</PropertyList.Body>
		</PropertyList>
	);
};
