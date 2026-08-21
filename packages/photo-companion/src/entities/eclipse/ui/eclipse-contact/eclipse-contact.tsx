import { type JSX, Show } from "solid-js";

import styles from "./eclipse-contact.module.css";

interface EclipseContactProps {
	children: JSX.Element;
	detail?: string;
	label: string;
	note?: string;
	peak?: boolean;
	visible: boolean;
}

export function EclipseContact(props: EclipseContactProps) {
	return (
		<li
			class={styles.contact}
			data-peak={props.peak ? "" : undefined}
			data-visible={props.visible ? "" : undefined}
		>
			<span aria-hidden="true" class={styles.marker} />
			<span class={styles.label}>{props.label}</span>
			{props.children}
			<Show when={props.detail}>
				<small class={styles.detail}>{props.detail}</small>
			</Show>
			<Show when={props.note}>
				<small class={styles.note}>{props.note}</small>
			</Show>
		</li>
	);
}
