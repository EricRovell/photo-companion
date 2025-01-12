import { For, Index, mergeProps, type ParentProps } from "solid-js";

import { X_RANGE, Y_MIN, Y_RANGE, Y_RANGE_TICKS } from "./elevation-graph.consts";
import { getTicks } from "./elevation-graph.helpers";
import { GraphPath } from "./path";
import { GraphPointer } from "./pointer";

import type { GraphEntityProps, GraphProps } from "./elevation-graph.types";

import styles from "./elevation-graph.module.css";

const Ticks = () => (
	<g class={styles.ticks}>
		<Index each={getTicks()}>
			{(item) => (
				<text
					dominant-baseline="middle"
					x={item().x}
					y={item().y}
				>
					{item().text}
				</text>
			)}
		</Index>
	</g>
);

const ZeroAxis = () => (
	<line
		class={styles["zero-axis"]}
		x1="0"
		x2={X_RANGE}
		y1="0"
		y2="0"
	/>
);

const View = (props: ParentProps) => (
	<svg
		class={styles.view}
		viewBox={`0 ${Y_MIN - Y_RANGE_TICKS} ${X_RANGE} ${Y_RANGE}`}
	>
		{props.children}
	</svg>
);

const GraphEntity = (props: GraphEntityProps) => (
	<g class={props.class} data-id={props.id}>
		<GraphPath
			date={props.date}
			getAltitude={props.getAltitude}
		/>
		<GraphPointer
			date={props.date}
			getAltitude={props.getAltitude}
			pointerSize={props.pointerSize}
		/>
	</g>
);

export function ElevationGraph(allProps: GraphProps) {
	const props = mergeProps({ date: new Date() }, allProps);

	return (
		<View>
			<ZeroAxis />
			<For each={props.entries}>
				{item => <GraphEntity date={props.date} {...item} />}
			</For>
			<Ticks />
		</View>
	);
}
