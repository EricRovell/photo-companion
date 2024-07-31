import { createEffect, createSignal, type JSX, mergeProps, splitProps } from "solid-js";
import { classnames, preventPageScroll } from "utils";

import type { Classes } from "../../types";

import styles from "./dialog.module.css";

export interface DialogProps extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, "class"> {
	classes?: Classes<"backdrop" | "dialog">;
	lightDismiss?: boolean;
	onClose?: () => void;
	preventPageScroll?: boolean;
}

const DEFAULT_PROPS = {
	lightDismiss: true,
	preventPageScroll: true
};

export function Dialog(allProps: DialogProps) {
	const mergedProps = mergeProps(DEFAULT_PROPS, allProps);
	const [ props, rest ] = splitProps(mergedProps, [
		"classes",
		"lightDismiss",
		"children",
		"onClose",
		"open",
		"preventPageScroll",
		"title"
	]);

	const [ getRef, setRef ] = createSignal<Nullish<HTMLDialogElement>>(null);

	const handleOpen = () => {
		getRef()?.showModal();
		document.documentElement.setAttribute("inert", "");
	};

	const handleClose = () => {
		props.onClose?.();
		getRef()?.close();
		document.documentElement.removeAttribute("inert");
	};

	const handleLightDismiss = (event: MouseEvent) => {
		const target = event.target as HTMLDivElement;

		if (target.hasAttribute("data-backdrop") && props.lightDismiss) {
			handleClose();
		}
	};

	createEffect(() => {
		if (!getRef()) {
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
			class={classnames(styles.dialog, props.classes?.dialog)}
			onClose={handleClose}
			ref={setRef}
			{...rest}
		>
			<div
				class={classnames(styles.backdrop, props.classes?.backdrop)}
				data-backdrop onClick={handleLightDismiss}
			>
				{props.children}
			</div>
		</dialog>
	);
}
