import { createMemo } from "solid-js";
import { isSameDay } from "utils/date";

import { useSettings } from "~/lib/context/settings";

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
	const { settings } = useSettings();
	const buildPath = () => createPathBuilder(props.getAltitude);

	const path = createMemo(() => {
		return buildPath()(props.date, settings.latitude, settings.longitude);
	}, MEMO_OPTIONS);

	return (
		<path
			class={styles.graph}
			d={path()}
		/>
	);
}
