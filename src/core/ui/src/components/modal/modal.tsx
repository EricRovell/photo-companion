import { createEffect, type JSX, mergeProps, splitProps } from "solid-js";
import { classnames, preventPageScroll } from "utils";

import { Button } from "../button/button";
import { IconClose } from "../icon";

import styles from "./modal.module.css";

interface Props extends JSX.DialogHtmlAttributes<HTMLDialogElement> {
	lightDismiss?: boolean;
	onClose?: () => void;
	preventPageScroll?: boolean;
	title: string;
}

const DEFAULT_PROPS = {
	lightDismiss: true,
	preventPageScroll: true
};

export function Modal(allProps: Props) {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(mergedProps, [
		"class",
		"lightDismiss",
		"children",
		"onClose",
		"open",
		"preventPageScroll",
		"title"
	]);

	let ref: Undefinable<HTMLDialogElement>;

	const handleOpen = () => {
		ref?.showModal();
	};

	const handleClose = () => {
		props.onClose?.();
		ref?.close();
	};

	const handleLightDismiss = (event: MouseEvent) => {
		const target = event.target as HTMLDivElement;

		if (target.hasAttribute("data-backdrop") && props.lightDismiss) {
			handleClose();
		}
	};

	createEffect(() => {
		if (!ref) {
			return;
		}

		if (props.open) {
			handleOpen();
		} else {
			handleClose();
		}

		props.preventPageScroll && preventPageScroll(props.open);
	});

	return (
		<dialog
			class={classnames(styles.dialog, props.class)}
			ref={ref}
			{...rest}
		>
			<div class={styles.backdrop} data-backdrop onClick={handleLightDismiss}>
				<aside class={styles.modal}>
					<header class={styles.header}>
						<h2>{props.title}</h2>
						<Button onClick={handleClose}>
							<IconClose />
						</Button>
					</header>
					<div class={styles.body}>
						{props.children}
					</div>
				</aside>
			</div>
		</dialog>
	);
}
