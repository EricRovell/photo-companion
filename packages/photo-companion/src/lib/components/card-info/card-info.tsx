import { type ParentProps, Show } from "solid-js";
import { classnames } from "utils";

import styles from "./card-info.module.css";

interface CardInfoProps extends ParentProps {
	classes?: {
		card?: string;
		list?: string;
		title?: string;
	};
	title?: string;
}

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

export const CardInfo = (props: CardInfoProps) => (
	<article class={classnames(styles.card, props.classes?.card)}>
		<Show when={props.title}>
			{title => (
				<header class={classnames(styles.title, props.classes?.title)}>
					{title()}
				</header>
			)}
		</Show>
		<dl class={props.classes?.list}>
			{props.children}
		</dl>
	</article>
);
