import { merge, omit } from "solid-js";

import type { JSX } from "@solidjs/web";

import { createDialogState } from "./dialog.state";

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
	const props = merge(DEFAULT_PROPS, allProps);
	const rest = omit(props, "classes",
		"lightDismiss",
		"children",
		"onClose",
		"open",
		"preventPageScroll",
		"title"
	);

	const { handleClose, handleLightDismiss, setRef } = createDialogState(props);

	return (
		<dialog
			class={[ styles.dialog, props.classes?.dialog ]}
			onClose={handleClose}
			ref={setRef}
			{...rest}
		>
			<div
				class={[ styles.backdrop, props.classes?.backdrop ]}
				data-backdrop
				onClick={handleLightDismiss}
			>
				{props.children}
			</div>
		</dialog>
	);
}
