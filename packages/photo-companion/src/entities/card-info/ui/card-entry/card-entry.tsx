import { type ParentProps } from "solid-js";
import { classnames } from "utils";

import styles from "./card-entry.module.css";

interface CardEntryProps extends ParentProps {
	class?: string;
	property: string;
}

export const CardEntry = (props: CardEntryProps) => (
	<div class={classnames(styles.entry, props.class)}>
		<dt>
			{props.property}
		</dt>
		<dd class={styles.value}>
			{props.children}
		</dd>
	</div>
);
