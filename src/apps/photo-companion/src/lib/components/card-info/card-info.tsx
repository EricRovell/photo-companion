import type { ParentProps } from "solid-js";

import styles from "./card-info.module.css";

interface CardEntry {
	property: string;
}

export const CardEntry = (props: ParentProps<CardEntry>) => (
	<div class={styles.entry}>
		<dt>
			{props.property}
		</dt>
		<dd class={styles.value}>
			{props.children}
		</dd>
	</div>
);

export const CardInfo = (props: ParentProps) => (
	<article class={styles.card}>
		<dl>
			{props.children}
		</dl>
	</article>
);
