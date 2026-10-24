import { createMemo, Show } from "solid-js";
import { linear } from "utils/easing";
import { normalizeDegrees } from "utils/math";

import { circular, createTweened, useDeviceHeading } from "~/shared/primitives";
import { Card, Text } from "~/shared/ui";

import { AZIMUTH_WIDGET_CONFIG } from "../../config";
import { createTweenedAzimuthPath } from "../../model";
import { AzimuthDial } from "../azimuth-dial/azimuth-dial";
import { AzimuthLegend } from "../azimuth-legend/azimuth-legend";
import { DeviceHeadingToggle } from "../device-heading-toggle/device-heading-toggle";

import type { AzimuthEntity, AzimuthWidgetEntity, AzimuthWidgetFormatters, AzimuthWidgetLabels, CardinalLabels } from "../../types";

import styles from "./azimuth-widget.module.css";

interface Props {
	entities: AzimuthWidgetEntity[];
	formatters: AzimuthWidgetFormatters;
	labels: AzimuthWidgetLabels;
	title: string;
}

const getShortLabel = (label: string) => label.slice(0, 1).toLocaleUpperCase();

interface ViewProps extends Props {
	deviceHeading: ReturnType<typeof useDeviceHeading>;
}

export function AzimuthWidgetView(props: ViewProps) {
	const deviceHeading = () => props.deviceHeading;

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

	const heading = createTweened(
		() => deviceHeading().status() === "active" ? deviceHeading().heading() ?? 0 : 0,
		{
			duration: AZIMUTH_WIDGET_CONFIG.animation.headingDuration,
			ease: linear,
			interpolate: circular(360),
			map: normalizeDegrees
		}
	);

	const cardinalLabels = createMemo<CardinalLabels>(() => ({
		east: getShortLabel(props.labels.east),
		north: getShortLabel(props.labels.north),
		south: getShortLabel(props.labels.south),
		west: getShortLabel(props.labels.west)
	}));

	const getAzimuth = (entity: AzimuthEntity) => entity === "sun" ? sunAzimuth() : moonAzimuth();
	const getPath = (entity: AzimuthEntity) => entity === "sun" ? sunPath() : moonPath();
	const toggleDeviceHeading = () => deviceHeading().status() === "active"
		? deviceHeading().stopHeading()
		: deviceHeading().requestHeading();

	return (
		<Card data-label="azimuth">
			<Card.Header class={styles.header}>
				<Text
					align="start"
					as="h2"
					class={styles.title}
					variant="heading-l"
				>
					{props.title}
				</Text>
				<Show when={deviceHeading().canAlign()}>
					<DeviceHeadingToggle
						active={deviceHeading().status() === "active"}
						error={deviceHeading().error()}
						labels={props.labels}
						onToggle={toggleDeviceHeading}
						pending={deviceHeading().status() === "requesting"}
					/>
				</Show>
			</Card.Header>

			<div class={styles.content}>
				<div class={styles.visual}>
					<AzimuthDial
						cardinalLabels={cardinalLabels()}
						entities={props.entities}
						formatters={props.formatters}
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
			</div>
		</Card>
	);
}

export function AzimuthWidget(props: Props) {
	const deviceHeading = useDeviceHeading();

	return <AzimuthWidgetView {...props} deviceHeading={deviceHeading} />;
}
