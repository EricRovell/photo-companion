import { type JSXElement, type ParentProps, Show } from "solid-js";
import { isNullable } from "utils/validators";

import { Time } from "~/shared/ui";

import styles from "./timeline.module.css";

export const TimelineGroup = (props: ParentProps) => (
	<div class={styles.wrapper}>
		{props.children}
	</div>
);

export const Timeline = (props: ParentProps<{ date?: JSXElement; }>) => (
	<article class={styles.timeline}>
		<Show when={!isNullable(props.date)}>
			<Time class={styles.datetime}>
				{props.date}
			</Time>
		</Show>
		<ol class={styles["timeline-entries"]}>
			{props.children}
		</ol>
	</article>
);
