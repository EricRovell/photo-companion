import { type JSX, Show } from "solid-js";

import { Text } from "~/shared/ui";

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
			<Text class={styles.label} color="secondary" variant="text-xs">{props.label}</Text>
			{props.children}
			<Show when={props.detail}>
				<Text as="small" color="secondary" variant="text-xs">{props.detail}</Text>
			</Show>
			<Show when={props.note}>
				<Text as="small" color="secondary" variant="text-xs">{props.note}</Text>
			</Show>
		</li>
	);
}
