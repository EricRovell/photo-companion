import { createMemo, Show } from "solid-js";

import { useTranslation } from "~/features/translation";
import { Text } from "~/shared/ui";

import { formatRiseSetDuration, getRiseSetSummary } from "../../lib";
import { RiseSetCountdown } from "../rise-set-countdown/rise-set-countdown";

import type { RiseSetWidgetProps } from "../../types";

import styles from "./rise-set-summary.module.css";

interface Props extends Pick<RiseSetWidgetProps, "aboveHorizon" | "belowHorizonInterval" | "date" | "entity" | "nextRise" | "rise" | "set"> {
	status: Nullable<string>;
	statusId: string;
}

export function RiseSetSummary(props: Props) {
	const { lang, t } = useTranslation();
	const summary = createMemo(() => getRiseSetSummary(props));
	const duration = createMemo(() => formatRiseSetDuration(summary().start, summary().end, lang()));

	const durationLabel = () => !props.aboveHorizon
		? t().RISE_SET.BELOW_HORIZON
		: props.entity === "moon" ? t().RISE_SET.ABOVE_HORIZON : t().RISE_SET.DAYLIGHT;

	const countdownLabel = () => props.entity === "moon"
		? summary().untilSet ? t().RISE_SET.UNTIL_MOONSET : t().RISE_SET.UNTIL_MOONRISE
		: summary().untilSet ? t().RISE_SET.UNTIL_SUNSET : t().RISE_SET.UNTIL_SUNRISE;

	const describedBy = () => props.status ? props.statusId : undefined;

	return (
		<div class={styles.summary}>
			<dl
				aria-describedby={describedBy()}
				class={styles.stats}
				title={props.status ?? undefined}
			>
				<div class={styles.stat} data-rise-set-duration>
					<Text
						as="dt"
						color="secondary"
						leading="relaxed"
						variant="text-xs"
					>
						{durationLabel()}
					</Text>
					<Text as="dd" color="secondary" numeric variant="text-m">
						{duration() || "—"}
					</Text>
				</div>
				<div class={styles.stat} data-rise-set-countdown>
					<Text
						as="dt"
						color="secondary"
						leading="relaxed"
						variant="text-xs"
					>
						{countdownLabel()}
					</Text>
					<Text as="dd" color="primary" numeric variant="heading-l">
						<RiseSetCountdown
							date={props.date}
							event={summary().nextEvent}
						/>
					</Text>
				</div>
			</dl>
			<Show when={props.status}>
				<p class={styles.description} id={props.statusId}>
					{props.status}
				</p>
			</Show>
		</div>
	);
}
