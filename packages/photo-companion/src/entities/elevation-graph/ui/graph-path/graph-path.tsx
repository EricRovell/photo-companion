import { createMemo } from "solid-js";
import { isSameDay } from "utils/date";

import { useSettings } from "~/features/settings";

import { createPathBuilder } from "../../lib";

import type { AltitudeGetter } from "../../types";

import styles from "./graph-path.module.css";

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
