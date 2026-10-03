import { type JSXElement, type ParentProps, Show } from "solid-js";
import { isNullable } from "utils/validators";

import { Text } from "~/shared/ui";

import styles from "./timeline.module.css";

export const TimelineGroup = (props: ParentProps) => (
	<div class={styles.wrapper}>
		{props.children}
	</div>
);

export const Timeline = (props: ParentProps<{ date?: JSXElement; }>) => (
	<article class={styles.timeline}>
		<Show when={!isNullable(props.date)}>
			<Text as="time" class={styles.datetime} numeric variant="text-m">
				{props.date}
			</Text>
		</Show>
		<ol class={styles["timeline-entries"]}>
			{props.children}
		</ol>
	</article>
);
