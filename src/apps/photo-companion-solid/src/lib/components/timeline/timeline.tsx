import type { TimelineGroupProps, TimelineProps } from "./timeline.types";

import styles from "./timeline.module.css";

export const TimelineGroup = (props: TimelineGroupProps) => (
	<div class={styles.wrapper}>
		{props.children}
	</div>
);

export const Timeline = (props: TimelineProps) => (
	<article class={styles.timeline}>
		{props.date}
		<ol class={styles["timeline-entries"]}>
			{props.children}
		</ol>
	</article>
);
