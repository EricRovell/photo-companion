import { Index, type ParentProps } from "solid-js";

import { createMarksCoords } from "./gauge.helpers";
import styles from "./gauge.module.css";

interface MarksProps {
	count: number;
	r1: number;
	r2: number;
}

export const MarksWrapper = (props: ParentProps) => (
	<g class={styles.marks}>
		{props.children}
	</g>
);

export const Marks = (props: MarksProps) => (
	<Index each={createMarksCoords(props.count, props.r1, props.r2)}>
		{index => <line {...index()} />}
	</Index>
);
