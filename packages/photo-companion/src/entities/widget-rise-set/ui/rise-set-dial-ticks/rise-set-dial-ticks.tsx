import { For } from "solid-js";

import { createRiseSetDialTicks } from "../../lib";

import styles from "./rise-set-dial-ticks.module.css";

const TICKS = createRiseSetDialTicks();

export function RiseSetDialTicks() {
	return (
		<For each={TICKS}>
			{tick => (
				<line
					class={tick.major ? styles.major : styles.tick}
					x1={tick.start.x}
					x2={tick.end.x}
					y1={tick.start.y}
					y2={tick.end.y}
				/>
			)}
		</For>
	);
}
