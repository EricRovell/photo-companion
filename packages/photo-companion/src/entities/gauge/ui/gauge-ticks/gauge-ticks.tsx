import { Index, type ParentProps } from "solid-js";

import { createTickCoords } from "../../lib";

import styles from "./gauge-ticks.module.css";

interface MarksProps {
	count: number;
	r1: number;
	r2: number;
}

export const TicksWrapper = (props: ParentProps) => (
	<g class={styles.ticks}>
		{props.children}
	</g>
);

export const Ticks = (props: MarksProps) => (
	<Index each={createTickCoords(props.count, props.r1, props.r2)}>
		{index => <line {...index()} />}
	</Index>
);
