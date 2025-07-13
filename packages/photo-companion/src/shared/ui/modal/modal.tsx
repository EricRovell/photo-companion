import { Show, splitProps } from "solid-js";
import { classnames } from "utils";

import { Button } from "../button/button";
import { Dialog, type DialogProps } from "../dialog/dialog";
import { IconClose } from "../icons";

import styles from "./modal.module.css";

interface Props extends DialogProps {
	lightDismiss?: boolean;
	onClose?: () => void;
	preventPageScroll?: boolean;
	title?: string;
}

export function Modal(allProps: Props) {
	const [ props, rest ] = splitProps(allProps, [
		"classes",
		"children",
		"onClose",
		"title"
	]);

	return (
		<Dialog
			classes={{
				backdrop: props.classes?.backdrop,
				dialog: classnames(styles.dialog, props.classes?.dialog)
			}}
			onClose={props.onClose}
			{...rest}
		>
			<aside class={styles.modal}>
				<header class={styles.header}>
					<Show when={props.title}>
						<h2>{props.title}</h2>
					</Show>
					<Button onClick={props.onClose}>
						<IconClose />
					</Button>
				</header>
				<div class={styles.body}>
					{props.children}
				</div>
			</aside>
		</Dialog>
	);
}
