import { createUniqueId } from "solid-js";

import type { ParentProps } from "solid-js";

import { Card, Text } from "~/shared/ui";

import { RISE_SET_WIDGET_CONFIG } from "../../config";
import { createRiseSetWidgetModel } from "../../model/create-rise-set-widget-model";
import { RiseSetDial } from "../rise-set-dial/rise-set-dial";
import { RiseSetLegend } from "../rise-set-legend/rise-set-legend";
import { RiseSetSummary } from "../rise-set-summary/rise-set-summary";

import type { RiseSetWidgetProps } from "../../types";

import styles from "./rise-set-widget.module.css";

export function RiseSetWidget(props: ParentProps<RiseSetWidgetProps>) {
	const model = createRiseSetWidgetModel(props);
	const statusId = createUniqueId();

	return (
		<Card data-label={props.entity}>
			<Card.Header>
				<Text as="h2" variant="heading-l">{model.title()}</Text>
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
						ariaLabel={model.ariaLabel()}
						currentTime={model.currentTime()}
						date={props.date}
						describedBy={model.status() ? statusId : undefined}
						rise={props.rise}
						set={props.set}
					>
						{props.children}
					</RiseSetDial>
					<RiseSetSummary
						aboveHorizon={props.aboveHorizon}
						belowHorizonInterval={props.belowHorizonInterval}
						date={props.date}
						entity={props.entity}
						nextRise={props.nextRise}
						rise={props.rise}
						set={props.set}
						status={model.status()}
						statusId={statusId}
					/>
					<RiseSetLegend renderTime={props.renderTime} rise={model.rise()} set={model.set()} />
				</div>
			</div>
		</Card>
	);
}
