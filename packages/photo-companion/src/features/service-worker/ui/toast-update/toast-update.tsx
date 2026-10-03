import { createEffect, on } from "solid-js";
import { toast } from "solid-sonner";

import { useTranslation } from "~/features/translation";
import { Button, Text } from "~/shared/ui";

import { useServiceWorker } from "../../model";

import styles from "./toast-update.module.css";

export function ToastUpdate() {
	const { t } = useTranslation();
	const { getSuggestUpdate, handleReload, setSuggestUpdate } = useServiceWorker();

	const handleClose = () => setSuggestUpdate(false);

	const Toast = () => (
		<aside class={styles.toast}>
			<Text as="p" color="success" variant="text-m">
				{t().MESSAGE.UPDATE}
			</Text>
			<Button class={styles.button} onClick={handleReload} variant="success">
				{t().LABEL.UPDATE}
			</Button>
		</aside>
	);

	createEffect(on(getSuggestUpdate, state => {
		if (state) {
			toast.custom(() => <Toast />, {
				duration: Infinity,
				onDismiss: handleClose
			});
		}
	}));

	return null;
}
