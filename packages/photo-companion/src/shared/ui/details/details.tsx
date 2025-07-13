import { type JSX, splitProps } from "solid-js";
import { classnames } from "utils";

import type { Classes } from "../../types";

import styles from "./details.module.css";

export interface DetailsProps extends JSX.DetailsHtmlAttributes<HTMLDetailsElement> {
	classes?: Classes<"content" | "details" | "label" | "summary">;
	label: string;
}

const DetailsIcon = () => (
	<svg class={styles.icon} viewBox="0 0 24 24">
		<polygon points="21.11 5.5 12 15.72 2.89 5.5 2 7.28 12 18.5 22 7.28 21.11 5.5" />
	</svg>
);

export function Details(allProps: DetailsProps) {
	const [ props, rest ] = splitProps(allProps, [
		"classes",
		"children",
		"label",
		"title"
	]);

	return (
		<details class={classnames(styles.details, props.classes?.details)} {...rest}>
			<summary class={classnames(styles.summary, props.classes?.summary)}>
				<span class={classnames("ellipsis", styles.title, props.classes?.label)}>
					{props.label}
				</span>
				<DetailsIcon />
			</summary>
			<div class={classnames(styles.content, props.classes?.content)}>
				{props.children}
			</div>
		</details>
	);
}
