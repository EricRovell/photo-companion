import type { ParentProps } from "solid-js";

import styles from "./altitude-content.module.css";

export function Content(props: ParentProps) {
	return <div class={styles.content}>{props.children}</div>;
}
