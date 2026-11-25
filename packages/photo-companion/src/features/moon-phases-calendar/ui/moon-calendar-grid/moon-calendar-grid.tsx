import { For } from "solid-js";
import { setAttribute } from "utils";
import { isSameDay } from "utils/date";

import { useTranslation } from "~/features/translation";

import { MOON_CALENDAR_WEEKDAYS } from "../../consts";
import { MoonCalendarDayCell } from "../moon-calendar-day-cell/moon-calendar-day-cell";

import type { MoonCalendarDay } from "../../types";

import styles from "./moon-calendar-grid.module.css";

interface MoonCalendarGridProps {
	monthId: string;
	selectedDay: number;
	weeks: MoonCalendarDay[][];
}

export function MoonCalendarGrid(props: MoonCalendarGridProps) {
	const { format } = useTranslation();

	return (
		<table
			aria-labelledby={props.monthId}
			class={styles.calendar}
		>
			<thead>
				<tr>
					<For each={MOON_CALENDAR_WEEKDAYS}>
						{weekday => (
							<th
								aria-label={format().utcWeekday(weekday)}
								class={styles.weekday}
								scope="col"
							>
								{format().utcWeekdayShort(weekday)}
							</th>
						)}
					</For>
				</tr>
			</thead>
			<tbody>
				<For each={props.weeks}>
					{week => (
						<tr>
							<For each={week}>
								{day => (
									<td
										class={styles.cell}
										data-outside-month={setAttribute(day.outsideMonth)}
									>
										{day.phase ? (
											<MoonCalendarDayCell
												day={day.day}
												phase={day.phase}
												selected={isSameDay(day.phase.timestamp, props.selectedDay)}
											/>
										) : day.day}
									</td>
								)}
							</For>
						</tr>
					)}
				</For>
			</tbody>
		</table>
	);
}
