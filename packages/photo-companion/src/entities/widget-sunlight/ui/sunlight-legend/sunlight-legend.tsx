import { For, Show } from "solid-js";

import { useTranslation } from "~/features/translation";

import { SUNLIGHT_WIDGET_CONFIG } from "../../config";

import type { SunlightDay, SunlightInterval, SunlightPhase } from "../../types";

import styles from "./sunlight-legend.module.css";

interface Props {
	currentPhase: SunlightPhase;
	day: SunlightDay;
	formatTime: (timestamp: number) => string;
	phaseLabel: (phase: SunlightPhase) => string;
}

interface RangesProps {
	formatTime: Props["formatTime"];
	intervals: SunlightInterval[];
}

function Ranges(props: RangesProps) {
	return (
		<Show when={props.intervals.length} fallback="—">
			<For each={props.intervals}>
				{interval => (
					<span class={styles.range}>
						<time dateTime={new Date(interval.start).toISOString()}>
							{props.formatTime(interval.start)}
						</time>
						<span>–</span>
						<time dateTime={new Date(interval.end).toISOString()}>
							{props.formatTime(interval.end)}
						</time>
					</span>
				)}
			</For>
		</Show>
	);
}

export function SunlightLegend(props: Props) {
	const { t } = useTranslation();

	const intervals = (phase: SunlightPhase) => props.day.intervals.filter(interval => interval.phase === phase);
	const periods = (phase: SunlightPhase, period: "evening" | "morning") => props.day.periods.filter(interval => interval.phase === phase && interval.period === period);
	const allDay = (phase: SunlightPhase) => props.day.intervals.length === 1 && props.day.intervals[0].phase === phase;
	const combined = (phase: SunlightPhase) => phase === "daylight" || phase === "night" || allDay(phase);

	return (
		<table aria-label={t().SUNLIGHT.TITLE} class={styles.table}>
			<thead>
				<tr>
					<th scope="col">{t().SUNLIGHT.LIGHT}</th>
					<th scope="col">{t().SUNLIGHT.MORNING}</th>
					<th scope="col">{t().SUNLIGHT.EVENING}</th>
				</tr>
			</thead>
			<tbody>
				<For each={SUNLIGHT_WIDGET_CONFIG.phases}>
					{phase => (
						<tr
							data-active={props.currentPhase === phase}
							data-phase={phase}
						>
							<th scope="row">
								<span class={styles.name}>
									<span aria-hidden="true" class={styles.swatch} />
									<span class={styles.label}>{props.phaseLabel(phase)}</span>
								</span>
							</th>
							<Show
								when={combined(phase)}
								fallback={(
									<For each={[ "morning", "evening" ] as const}>
										{period => <td>
											<Ranges
												formatTime={props.formatTime}
												intervals={periods(phase, period)}
											/>
										</td>}
									</For>
								)}
							>
								<td colSpan={2}>
									<Show
										when={allDay(phase)}
										fallback={(
											<Ranges
												formatTime={props.formatTime}
												intervals={intervals(phase)}
											/>
										)}
									>
										{t().SUNLIGHT.ALL_DAY}
									</Show>
								</td>
							</Show>
						</tr>
					)}
				</For>
			</tbody>
		</table>
	);
}
