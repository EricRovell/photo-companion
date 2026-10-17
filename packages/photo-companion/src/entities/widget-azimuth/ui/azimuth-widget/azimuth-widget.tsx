import { createMemo, Show } from "solid-js";
import { normalizeDegrees } from "utils/math";

import { circular, createTweened, useDeviceHeading } from "~/shared/primitives";
import { Card, Text } from "~/shared/ui";

import { AZIMUTH_WIDGET_CONFIG } from "../../config";
import { createTweenedAzimuthPath } from "../../model";
import { AzimuthDial } from "../azimuth-dial/azimuth-dial";
import { AzimuthLegend } from "../azimuth-legend/azimuth-legend";
import { DeviceAlignment } from "../device-alignment/device-alignment";

import type { AzimuthEntity, AzimuthWidgetEntity, AzimuthWidgetLabels, CardinalLabels } from "../../types";

import styles from "./azimuth-widget.module.css";

interface Props {
	entities: AzimuthWidgetEntity[];
	labels: AzimuthWidgetLabels;
	title: string;
}

const getShortLabel = (label: string) => label.slice(0, 1).toLocaleUpperCase();

export function AzimuthWidget(props: Props) {
	const deviceHeading = useDeviceHeading();

	const sunAzimuth = createTweened(
		() => normalizeDegrees(props.entities.find(entity => entity.id === "sun")?.azimuth ?? 0),
		{ duration: AZIMUTH_WIDGET_CONFIG.animation.transitionDuration, interpolate: circular(360), map: normalizeDegrees }
	);

	const moonAzimuth = createTweened(
		() => normalizeDegrees(props.entities.find(entity => entity.id === "moon")?.azimuth ?? 0),
		{ duration: AZIMUTH_WIDGET_CONFIG.animation.transitionDuration, interpolate: circular(360), map: normalizeDegrees }
	);

	const sunPath = createTweenedAzimuthPath(
		() => props.entities.find(entity => entity.id === "sun")?.path ?? []
	);

	const moonPath = createTweenedAzimuthPath(
		() => props.entities.find(entity => entity.id === "moon")?.path ?? []
	);

	const heading = createTweened(() => deviceHeading.heading() ?? 0, {
		duration: AZIMUTH_WIDGET_CONFIG.animation.headingDuration,
		interpolate: circular(360),
		map: normalizeDegrees
	});

	const cardinalLabels = createMemo<CardinalLabels>(() => ({
		east: getShortLabel(props.labels.east),
		north: getShortLabel(props.labels.north),
		south: getShortLabel(props.labels.south),
		west: getShortLabel(props.labels.west)
	}));

	const getAzimuth = (entity: AzimuthEntity) => entity === "sun" ? sunAzimuth() : moonAzimuth();
	const getPath = (entity: AzimuthEntity) => entity === "sun" ? sunPath() : moonPath();

	return (
		<Card data-label="azimuth">
			<Card.Header>
				<Text as="h2" variant="heading-l">{props.title}</Text>
			</Card.Header>

			<div class={styles.content}>
				<div class={styles.visual}>
					<AzimuthDial
						cardinalLabels={cardinalLabels()}
						entities={props.entities}
						getAzimuth={getAzimuth}
						getPath={getPath}
						heading={heading()}
					/>
					<AzimuthLegend
						cardinalLabels={cardinalLabels()}
						entities={props.entities}
						getAzimuth={getAzimuth}
						labels={props.labels}
					/>
				</div>

				<Show when={deviceHeading.canRequest() && deviceHeading.status() !== "active"}>
					<DeviceAlignment
						error={deviceHeading.error()}
						labels={props.labels}
						onRequest={deviceHeading.requestHeading}
						pending={deviceHeading.status() === "requesting"}
					/>
				</Show>
			</div>
		</Card>
	);
}
