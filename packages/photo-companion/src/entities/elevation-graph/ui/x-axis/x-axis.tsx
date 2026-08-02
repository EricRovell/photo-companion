import { Index } from "solid-js";

import type { JSX } from "solid-js";

import { getTicks } from "../../lib";

import styles from "./x-axis.module.css";

export const XAxis = (props: JSX.SvgSVGAttributes<SVGGElement>) => (
	<g {...props}>
		<Index each={getTicks()}>
			{item => (
				<text
					class={styles["x-axis-tick"]}
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
