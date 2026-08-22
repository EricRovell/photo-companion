import { Index } from "solid-js";
import { isNullable } from "utils/validators";

import { createQueryDate } from "~/shared/lib/query-date";

import type { InputDatetimeModel } from "../../model/create-input-datetime-model";

import styles from "./datetime-timeline.module.css";

interface DatetimeTimelineProps {
	disabled: boolean;
	label: string;
	model: InputDatetimeModel;
}

export function DatetimeTimeline(props: DatetimeTimelineProps) {
	return (
		<div class={styles["timeline-control"]}>
			<time class={styles["selected-value"]} datetime={createQueryDate(props.model.selectedDate())}>
				{props.model.selectedValue()}
			</time>
			<div
				aria-label={props.label}
				aria-valuenow={props.model.selectedDate().getTime()}
				aria-valuetext={props.model.selectedValue()}
				class={styles.timeline}
				data-dragging={props.model.dragging() ? "" : undefined}
				data-page-swipe="ignore"
				onClick={event => props.model.handleTickClick(event)}
				onKeyDown={event => props.model.handleKeyDown(event)}
				onPointerCancel={event => props.model.handlePointerCancel(event)}
				onPointerDown={event => props.model.handlePointerDown(event)}
				onPointerMove={event => props.model.handlePointerMove(event)}
				onPointerUp={event => props.model.handlePointerUp(event)}
				role="slider"
				tabIndex={props.disabled ? -1 : 0}
			>
				<div
					aria-hidden="true"
					class={styles.track}
					style={{ transform: `translate3d(calc(-50% + ${props.model.offset()}px), 0, 0)` }}
				>
					<Index each={props.model.ticks()}>
						{tick => {
							const selected = () => tick().offset === props.model.selectedStep();

							return (
								<span
									class={styles.tick}
									data-disabled={isNullable(tick().date) ? "" : undefined}
									data-selected={selected() ? "" : undefined}
									data-tick-offset={tick().offset}
								>
									<span class={styles.primary}>{props.model.formatTickLabel(tick().date)}</span>
								</span>
							);
						}}
					</Index>
				</div>
			</div>
		</div>
	);
}
