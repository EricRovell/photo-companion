import { createRenderEffect, createSignal, onCleanup } from "solid-js";

import type { JSX } from "@solidjs/web";

import { preventPageScroll } from "./dialog.helpers";

import type { DialogProps } from "./dialog";

export function createDialogState(props: DialogProps) {
	const [ getRef, setRef ] = createSignal<Nullish<HTMLDialogElement>>(null);

	let ownsModalState = false;
	let scrollLocked = false;

	const releaseModalState = () => {
		if (ownsModalState) {
			document.documentElement.removeAttribute("inert");
			ownsModalState = false;
		}

		if (scrollLocked) {
			preventPageScroll(false);
			scrollLocked = false;
		}
	};

	const handleOpen = (dialog: HTMLDialogElement, preventScroll: boolean | undefined) => {
		if (!dialog.open) {
			dialog.showModal();
		}

		document.documentElement.setAttribute("inert", "");
		ownsModalState = true;

		if (scrollLocked !== Boolean(preventScroll)) {
			preventPageScroll(preventScroll);
			scrollLocked = Boolean(preventScroll);
		}
	};

	const closeDialog = (dialog: HTMLDialogElement) => {
		if (dialog.open) {
			dialog.close();
		}

		releaseModalState();
	};

	const handleClose: JSX.EventHandler<HTMLDialogElement, Event> = (event) => {
		if (event.currentTarget.open) {
			return;
		}

		releaseModalState();
		props.onClose?.();
	};

	const handleLightDismiss = (event: MouseEvent) => {
		const target = event.target;

		if (target instanceof Element && target.hasAttribute("data-backdrop") && props.lightDismiss) {
			const dialog = getRef();

			if (dialog) {
				closeDialog(dialog);
			}
		}
	};

	createRenderEffect(() => ({
		open: props.open === "" || props.open === true,
		preventScroll: props.preventPageScroll,
		ref: getRef()
	}), ({ open, preventScroll, ref }) => {
		if (!ref) {
			return;
		}

		if (open) {
			handleOpen(ref, preventScroll);
		} else {
			closeDialog(ref);
		}
	});

	onCleanup(releaseModalState);

	return {
		handleClose,
		handleLightDismiss,
		setRef
	};
}
