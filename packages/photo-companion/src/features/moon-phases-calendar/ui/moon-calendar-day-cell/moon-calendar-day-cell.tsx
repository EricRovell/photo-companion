import { Show } from "solid-js";

import { Moon } from "~/entities/moon";
import { useDatetime } from "~/features/datetime-query";
import { LinkQuery } from "~/features/navigation";
import { useTranslation } from "~/features/translation";
import { ROUTES } from "~/shared/consts";
import { createQueryDate } from "~/shared/lib/query-date";
import { Text } from "~/shared/ui";

import { MOON_CALENDAR_PHASE_PRECISION } from "../../consts";
import { getCalendarSelectionDatetime } from "../../lib";

import type { MoonCalendarPhase } from "../../types";

import styles from "./moon-calendar-day-cell.module.css";

interface MoonCalendarDayCellProps {
	day: number;
	phase: MoonCalendarPhase;
	selected: boolean;
}

function MoonCalendarDayCellContent(props: Pick<MoonCalendarDayCellProps, "day" | "phase">) {
	return (
		<>
			<Text
				as="time"
				class={{
					[styles["day-number"]]: true,
					[styles["principal-phase"]]: props.phase.principal
				}}
				datetime={createQueryDate(props.phase.timestamp).slice(0, 10)}
				numeric
				variant="text-s"
			>
				{props.day}
			</Text>
			<Moon
				aria-hidden="true"
				class={styles.moon}
				phase={props.phase.value}
				precision={MOON_CALENDAR_PHASE_PRECISION}
			/>
		</>
	);
}

export function MoonCalendarDayCell(props: MoonCalendarDayCellProps) {
	const { getDisplayedDatetime } = useDatetime();
	const { format, t } = useTranslation();

	const cellClasses = () => ({
		[styles.day]: true,
		[styles.selected]: props.selected
	});

	const label = () => [
		format().date(props.phase.timestamp),
		t().MOON_PHASE[props.phase.name],
		props.phase.principal ? format().timeShort(props.phase.timestamp) : format().percent(props.phase.fraction)
	].join(" · ");

	const selectionDatetime = () => getCalendarSelectionDatetime(props.phase.timestamp, getDisplayedDatetime());

	return (
		<Show
			when={props.phase.selectable}
			fallback={(
				<div
					aria-current={props.selected ? "date" : undefined}
					aria-label={label()}
					class={cellClasses()}
					role="img"
					title={label()}
				>
					<MoonCalendarDayCellContent
						day={props.day}
						phase={props.phase}
					/>
				</div>
			)}
		>
			<LinkQuery
				aria-current={props.selected ? "date" : "false"}
				aria-label={label()}
				class={[ cellClasses(), styles.link ]}
				href={ROUTES.MOON}
				noscroll
				query={new URLSearchParams({ datetime: selectionDatetime() })}
				title={label()}
			>
				<MoonCalendarDayCellContent
					day={props.day}
					phase={props.phase}
				/>
			</LinkQuery>
		</Show>
	);
}
