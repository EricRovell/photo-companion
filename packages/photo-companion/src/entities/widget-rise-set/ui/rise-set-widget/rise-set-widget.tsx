import { createMemo, createUniqueId, Show } from "solid-js";

import type { ParentProps } from "solid-js";

import { useTranslation } from "~/features/translation";
import { Card, Text } from "~/shared/ui";

import { RISE_SET_WIDGET_CONFIG } from "../../config";
import { buildRiseSetAriaLabel, formatRiseSetDuration, formatRiseSetEvent, getRiseSetStatusKey } from "../../lib";
import { RiseSetDial } from "../rise-set-dial/rise-set-dial";
import { RiseSetLegend } from "../rise-set-legend/rise-set-legend";

import type { RiseSetWidgetProps } from "../../types";

import styles from "./rise-set-widget.module.css";

export function RiseSetWidget(props: ParentProps<RiseSetWidgetProps>) {
	const { format, lang, t } = useTranslation();
	const statusId = createUniqueId();

	const title = () => props.entity === "moon" ? t().TITLE.MOON_TIMES : t().TITLE.SUN_TIMES;
	const riseLabel = () => props.entity === "moon" ? t().MOON_TIMES.MOONRISE : t().RISE_SET.SUNRISE;
	const setLabel = () => props.entity === "moon" ? t().MOON_TIMES.MOONSET : t().RISE_SET.SUNSET;

	const eventOptions = () => ({
		date: props.date,
		formatDate: format().dateShort,
		formatTime: format().timeShort,
		labels: t().RISE_SET
	});

	const rise = createMemo(() => formatRiseSetEvent(props.rise, riseLabel(), eventOptions()));
	const set = createMemo(() => formatRiseSetEvent(props.set, setLabel(), eventOptions()));
	const duration = createMemo(() => formatRiseSetDuration(props.rise, props.set, lang()));

	const status = () => {
		const key = getRiseSetStatusKey(props);
		return key ? t().RISE_SET[key] : null;
	};

	return (
		<Card data-label={props.entity}>
			<Card.Header>
				<Text as="h2" variant="heading-l">{title()}</Text>
			</Card.Header>
			<div
				class={styles.content}
				data-entity={props.entity}
				style={{
					"--rise-set-color": RISE_SET_WIDGET_CONFIG.colors[props.entity],
					"--rise-set-max-width": RISE_SET_WIDGET_CONFIG.layout.maxWidth
				}}
			>
				<div class={styles.visual}>
					<RiseSetDial
						aboveHorizon={props.aboveHorizon}
						ariaLabel={buildRiseSetAriaLabel(title(), rise(), set())}
						currentTime={format().timeShort(props.date)}
						date={props.date}
						describedBy={status() ? statusId : undefined}
						rise={props.rise}
						set={props.set}
					>
						{props.children}
					</RiseSetDial>
					<Show when={status() ?? duration()}>
						<Text
							align="center"
							as="p"
							class={styles.summary}
							color={status() ? "danger" : "secondary"}
							data-rise-set-duration={!!duration() || undefined}
							id={status() ? statusId : undefined}
							leading="relaxed"
							numeric
							variant="text-xs"
						>
							{status() ?? `${t().RISE_SET.DURATION} · ${duration()}`}
						</Text>
					</Show>
					<RiseSetLegend renderTime={props.renderTime} rise={rise()} set={set()} />
				</div>
			</div>
		</Card>
	);
}
