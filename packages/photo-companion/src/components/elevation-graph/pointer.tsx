import { createMemo, mergeProps } from "solid-js";
import { setAttribute } from "utils";

import { useSettings } from "~/services/settings";

import { createObjectCoordsGetter } from "./elevation-graph.helpers";

import type { AltitudeGetter } from "./elevation-graph.types";

import styles from "./elevation-graph.module.css";

interface Props {
	date: Date;
	getAltitude: AltitudeGetter;
	pointerSize?: number;
}

const DEFAULT_PROPS = {
	pointerSize: 6
};

export function GraphPointer(allProps: Props) {
	const props = mergeProps(DEFAULT_PROPS, allProps);
	const { settings } = useSettings();

	const getPosition = () => createObjectCoordsGetter(props.getAltitude);
	const position = createMemo(() => getPosition()(props.date, settings.latitude, settings.longitude));

	return (
		<circle
			class={styles.pointer}
			cx={position().x}
			cy={position().y}
			data-above={setAttribute(position().y >= 0)}
			r={props.pointerSize}
		/>
	);
}
