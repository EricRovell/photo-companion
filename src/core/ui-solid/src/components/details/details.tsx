import { splitProps, mergeProps  } from "solid-js";
import { classnames } from "utils";

import { DetailsProps } from "./details.types";
import styles from "./details.module.css";

const DEFAULT_PROPS: Partial<DetailsProps> = {
	open: false
};

const DetailsIcon = () => (
	<svg class={styles.icon} viewBox="0 0 24 24">
		<polygon points="21.11 5.5 12 15.72 2.89 5.5 2 7.28 12 18.5 22 7.28 21.11 5.5" />
	</svg>
);

export function Details(allProps: DetailsProps) {
	const merged = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(merged, [
		"class",
		"children",
		"label",
		"title"
	]);

	return (
		<details class={classnames(styles.details, props.class)} {...rest}>
			<summary class={styles.summary}>
				<span class={classnames("ellipsis", styles.title)}>
					{props.label}
				</span>
				<DetailsIcon />
			</summary>
			<div class={styles.content}>
				{props.children}
			</div>
		</details>
	);
}
