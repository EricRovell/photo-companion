import { createMemo } from "solid-js";
import { isSameDay } from "utils/date";

import { useLocation } from "@lib/hooks";

import { createPathBuilder } from "./elevation-graph.helpers";

import type { AltitudeGetter } from "./elevation-graph.types";

import styles from "./elevation-graph.module.css";

interface Props {
	date: Date;
	getAltitude: AltitudeGetter;
}

const MEMO_OPTIONS = {
	equals: (prev: Date, next: Date) => isSameDay(prev, next)
};

export function GraphPath(props: Props) {
	const { getLatitude, getLongitude } = useLocation();
	const buildPath = () => createPathBuilder(props.getAltitude);

	const path = createMemo(() => {
		return buildPath()(props.date, getLatitude(), getLongitude());
	}, MEMO_OPTIONS);

	return (
		<path
			class={styles.graph}
			d={path()}
		/>
	);
}
