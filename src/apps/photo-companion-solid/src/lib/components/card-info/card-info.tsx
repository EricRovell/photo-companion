import { For, type JSXElement } from "solid-js";
import { objectEntries } from "utils";

import styles from "./card-info.module.css";

interface Props {
	data: Record<string, string | number>
}

interface CardEntry {
	property: string;
	value: JSXElement;
}

const CardEntry = (props: CardEntry) => (
	<div class={styles.entry}>
		<dt>
			{props.property}
		</dt>
		<dd class={styles.value}>
			{props.value}
		</dd>
	</div>
);

export const CardInfo = (props: Props) => (
	<article class={styles.card}>
		<dl>
			<For each={objectEntries(props.data)}>
				{item => (
					<CardEntry property={item[0]} value={item[1]} />
				)}
			</For>
		</dl>
	</article>
);
