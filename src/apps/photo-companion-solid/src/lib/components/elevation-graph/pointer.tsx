import { createMemo, mergeProps } from "solid-js";

import { setAttribute } from "@lib/helpers";
import { useLocation } from "@lib/hooks";
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
	const { getLatitude, getLongitude } = useLocation();

	const getPosition = () => createObjectCoordsGetter(props.getAltitude);
	const position = createMemo(() => {
		return getPosition()(props.date, getLatitude(), getLongitude());
	});

	return (
		<circle
			class={styles.pointer}
			data-above={setAttribute(position().y >= 0)}
			cx={position().x}
			cy={position().y}
			r={props.pointerSize}
		/>
	);
}
